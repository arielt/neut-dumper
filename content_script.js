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

function bufferFull() {
    reportTimelineEvent("bufferFull");
}

if (window.performance && performance.timing && chrome.runtime) {
    // load event: with default run_at, browser chooses when to inject the script
    if (document.readyState === 'complete') {
        reportTimelineEvent('load');
    } else {
        window.addEventListener('load', function () {
            reportTimelineEvent('load');
        });
    }

    // unload event
    window.addEventListener('unload', function () {
        reportTimelineEvent('unload');
    });

    window.addEventListener('hashchange', function () {
        reportTimelineEvent('hashchange');
    });

    window.addEventListener('popstate', function () {
        reportTimelineEvent('popstate');
    });

    // performance resource timing buffer is full
    performance.onresourcetimingbufferfull = bufferFull;
}
