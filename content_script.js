/**
 * Content script to be injected to the loaded page. Runs with default run_at
 * parameter: https://developer.chrome.com/extensions/content_scripts.
 */

"use strict";
/*jslint browser:true, todo: true*/
/*global performance, chrome*/

function reportTimelineEvent(type) {
    chrome.runtime.sendMessage({
        'type': 'timelineEvent',
        'data': {
            'ts': performance.now(),
            'type': type,
            'location': JSON.stringify(location),
            'performance': JSON.stringify(performance.getEntries())
        }
    });
}

function onLoad() {
    reportTimelineEvent('load');
}

function onUnload() {
    reportTimelineEvent('unload');
}

function bufferFull() {
    reportTimelineEvent('timingBufferFull');
}

if (window.performance && performance.timing && chrome.runtime) {
    // load event: with default run_at, browser chooses when to inject the script
    if (document.readyState === 'complete') {
        onLoad();
    } else {
        window.addEventListener('load', onLoad);
    }

    // unload event
    window.addEventListener('unload', onUnload);

    // performance resource timing buffer is full
    performance.onresourcetimingbufferfull = bufferFull;
}
