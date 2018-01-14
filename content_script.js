/**
 * Content script to be injected to the loaded page. Runs with default run_at
 * parameter: https://developer.chrome.com/extensions/content_scripts.
 * Timing API: https://www.w3.org/TR/navigation-timing.
 * All page information, including URLs has to be collected by content script.
 */

"use strict";
/*jslint browser:true, todo: true*/
/*global performance, chrome*/

function onLoad() {
    console.log("handler: onload");
}

function onUnload() {
    console.log("handler: unload");
}

function bufferFull() {
    console.log("handler: buffer is full");
}

if (window.performance && performance.timing && chrome.runtime) {
    console.log("xxx: able to register");
    // load event: with default run_at, browser chooses when to inject the script
    if (document.readyState === 'complete') {
        onLoad();
    } else {
        window.addEventListener('load', onLoad);
    }

    // unload event
    window.addEventListener('unload', onUnload);

    // performance resource timing buffer is full
    console.log("register full buffer handler");
    performance.onresourcetimingbufferfull = bufferFull;
}
