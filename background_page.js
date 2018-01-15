"use strict";
/*jslint browser:true, todo: true*/
/*global chrome, indexedDB*/

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
        console.log('Error', e.target.error.name);
    };
    request.onsuccess = function (e) {
        console.log('Woot! Did it' + e);
    };
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
            addItemToDbTimeline(msg.data);
            break;
        case 'download':
            break;
        case 'clear':
            break;
        }
    }
);
/*jslint unparam: false*/
