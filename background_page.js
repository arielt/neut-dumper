"use strict";
/*jslint browser:true, todo: true*/
/*global chrome*/

// handling messages both from content script and extension popup
/*jslint unparam: true*/
chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        switch (msg.type) {
        case 'timelineEvent':
            // timeline event sent by content script
            console.log("xxx: timelineEvent");
            console.log(msg.data);
            break;
        case 'popupCleanupDatabase':
        case 'popupExportDatabase':
            break;
        }
    }
);
/*jslint unparam: false*/

// load background page
console.log("xxx: loading background page");
