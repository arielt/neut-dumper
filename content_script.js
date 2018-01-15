/**
 * Content script to be injected to the loaded page. Runs with default run_at
 * parameter: https://developer.chrome.com/extensions/content_scripts.
 */

"use strict";
/*jslint browser:true, todo: true*/
/*global performance, chrome*/

// current URL
var currentPage = window.location.href;

function reportTimelineEvent(type) {
    chrome.runtime.sendMessage({
        'type': 'timelineEvent',
        'data': {
            'ts':  null, // to be timestamped when inserting into database
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

    window.addEventListener('beforeunload', function () {
        reportTimelineEvent('beforeunload');
    });

    window.addEventListener('hashchange', function () {
        reportTimelineEvent('hashchange');
    });

    window.addEventListener('popstate', function () {
        reportTimelineEvent('popstate');
    });

    // performance resource timing buffer is full
    performance.onresourcetimingbufferfull = bufferFull;

    // listen for URL changes
    setInterval(function () {
        if (currentPage !== window.location.href) {
            currentPage = window.location.href;
            reportTimelineEvent('urlChange');
        }
    }, 500);
}
