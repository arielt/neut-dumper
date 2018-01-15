"use strict";
/*jslint browser:true, todo: true*/
/*global chrome, indexedDB, URL, Blob*/

var DB_VERSION = 1;
var DB_NAME = 'neut-dumper';
var STORE = 'timeline';

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

    if (!db.objectStoreNames.contains(STORE)) {
        console.log("creating timeline store");
        db.createObjectStore(STORE, {keyPath: 'ts'});
    }
};

// add item to timeline store in database
function addItemToDbTimeline(item) {
    var transaction = db.transaction([STORE], 'readwrite'),
        store = transaction.objectStore(STORE),
        request = store.add(item);

    request.onerror = function (e) {
        console.error('Error', e.target.error.name);
    };
    /*
    request.onsuccess = function (e) {
    };
    */
}

function downloadDb() {
    var transaction = db.transaction(STORE, 'readonly'),
        objectStore = transaction.objectStore(STORE);

    if (objectStore.getAll === undefined) {
        console.error("Object store has no getAll method");
        return;
    }

    objectStore.getAll().onsuccess = function (event) {
        var blob = new Blob([JSON.stringify(event.target.result, null, 2)], {type : 'application/json'}),
            url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: 'neut-dump-timeseries.json'
        });
    };
}

function clearDb() {
    var transaction = db.transaction(STORE, 'readwrite'),
        objectStore = transaction.objectStore(STORE);
    objectStore.clear();
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
            addItemToDbTimeline(msg.data);
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
