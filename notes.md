# Notes

* https://www.stevesouders.com/blog/2014/08/21/resource-timing-practical-tips/

* https://nicj.net/resourcetiming-in-practice/

* https://developer.chrome.com/extensions/webRequest

* http://www.picturetopeople.org/text_generator/others/transparent/transparent-text-generator.html

  Primary color: #337ab7, Font: ethnocentric

* webRequest: https://developer.chrome.com/extensions/webRequest

## TODO:

* add listeners: onHeadersReceived -> inject Timing-Allow-Origin

* Examine how requests and response can be measured.

* Find out how request and response can be correlated, whether they have timestamps.
  requestId

* Cache hit: onCompleted.fromCache

* For tracing, add handlers: onCompleted, onErrorOccured, onBeforeRequest (before TCP connection is established)

* Get the size of the object: https://stackoverflow.com/questions/38038450/chrome-webrequest-oncompleted-size-of-the-page
