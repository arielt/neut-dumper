"use strict";
/*jslint browser:true, todo: true*/
/*global chrome, indexedDB, URL, Blob*/

var DB_VERSION = 1;
var DB_NAME = 'neut-dumper';
var TIMING_STORE = 'timing';
var REQ_STORE = 'req';

var db;

// open database
var openRequest = indexedDB.open(DB_NAME, 1);
openRequest.onerror = function (event) {
    console.error("Can't open the database");
    console.dir(event);
};
openRequest.onsuccess = function (event) {
    db = event.target.result;
};
openRequest.onupgradeneeded = function (event) {
    var db = event.target.result;

    console.log("running database upgrade");

    if (!db.objectStoreNames.contains(TIMING_STORE)) {
        console.log("creating timing store");
        db.createObjectStore(TIMING_STORE, {keyPath: 'ts'});
    }

    if (!db.objectStoreNames.contains(REQ_STORE)) {
        console.log("creating requests store");
        db.createObjectStore(REQ_STORE, {keyPath: 'timeStamp'});
    }
};

function putToStore(store, item) {
    var transaction = db.transaction([store], 'readwrite'),
        s = transaction.objectStore(store),
        req = s.add(item);

    req.onerror = function (e) {
        console.error('Error', e.target.error.name);
    };
}

// download store and database
function downloadStore(store, filename) {
    var transaction = db.transaction(store, 'readonly'),
        objectStore = transaction.objectStore(store);

    if (objectStore.getAll === undefined) {
        console.error("Object store has no getAll method");
        return;
    }

    objectStore.getAll().onsuccess = function (event) {
        var blob = new Blob([JSON.stringify(event.target.result, null, 2)], {type : 'application/json'}),
            url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: filename
        });
    };
}

function downloadDb() {
    downloadStore(TIMING_STORE, 'neut-dump-timing.json');
    downloadStore(REQ_STORE, 'neut-dump-req.json');
}

// clear store and database
function clearStore(store) {
    var transaction, objectStore;

    // clear timing store
    transaction = db.transaction(store, 'readwrite');
    objectStore = transaction.objectStore(store);
    objectStore.clear();
}

function clearDb() {
    clearStore(TIMING_STORE);
    clearStore(REQ_STORE);
}

// handling messages both from content script and extension popup
/*jslint unparam: true*/
chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        switch (msg.type) {
        case 'timelineEvent':
            // timestamp the data, add window and tab IDs
            msg.data.ts = Date.now();
            msg.data.tabId = sender.tab.id;
            msg.data.windowId = sender.tab.windowId;
            msg.data.location = JSON.parse(msg.data.location);
            msg.data.performance = JSON.parse(msg.data.performance);
            putToStore(TIMING_STORE, msg.data);
            break;
        case 'download':
            downloadDb();
            break;
        case 'clear':
            clearDb();
            break;
        }
    }
);
/*jslint unparam: false*/

// injects Timing-Allow-Origin:*
function injectTimingHeader(details) {
    var flag = false,
        rule = {
            "name": "Timing-Allow-Origin",
            "value": "*"
        },
        i;

    for (i = 0; i < details.responseHeaders.length; i += 1) {
        if (details.responseHeaders[i].name.toLowerCase() === rule.name.toLowerCase()) {
            flag = true;
            details.responseHeaders[i].value = rule.value;
            break;
        }
    }

    if (!flag) {
        details.responseHeaders.push(rule);
    }

    details.customHeader = 'huiamba';

    return {responseHeaders: details.responseHeaders};
}

// log web request
function logWebRequest(details) {
    details.type = 'request';
    putToStore(REQ_STORE, details);
}

// log web response
function logWebResponse(details) {
    var fileSize, i;
    for (i = 0; i < details.responseHeaders.length; i += 1) {
        if (details.responseHeaders[i].name.toLowerCase() === 'content-length') {
            fileSize = details.responseHeaders[i].value;
            break;
        }
    }
    details.type = 'response';
    details.transferSize = fileSize;
    delete details.responseHeaders;
    putToStore(REQ_STORE, details);
}

// register webRequest listeners
chrome.webRequest.onHeadersReceived.addListener(
    injectTimingHeader,
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
    logWebRequest,
    {urls: ["<all_urls>"]},
    []
);

chrome.webRequest.onCompleted.addListener(
    logWebResponse,
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);
