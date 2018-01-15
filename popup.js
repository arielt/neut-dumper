"use strict";

/*jslint browser:true */
/*global chrome, $, jQuery*/

/*jslint unparam: true*/
$('#download').on('click', function (event) {
    chrome.runtime.sendMessage(
        {'type': 'download'}
    );
});

$('#clear').on('click', function (event) {
    chrome.runtime.sendMessage(
        {'type': 'clear'}
    );
});
/*jslint unparam: false*/
