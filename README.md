# Neut dumper

Neut dumper collects raw performance data triggered by different events. Collected
data can be inspected in IndexedDB or downloaded as a file.


## Installation

Clone the repo and install neut-dump as extension. Supported browsers:

* Firefox

* Chrome


## Operations

To get the data stored in the database, open extension UI and click download.
It will download the database in JSON format:

* neut-dump-timing.json: resource timing data

* neut-dump-req.json: web request / response data

To clear database, click Clear.

To allow collection of attributes retrieved via Resource Timing API,
this extension injects Timing-Allow-Origin:* into every received HTTP header.

## Collected data

Each resource timing entry represents recorded event:

* ts: unique timestamp

* type: see Tracked events

* windowId, tabId: IDs used by browser

* location: location(URL) data

* performance: snapshot of page performance metrics (https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)

Each request response data:

* type: request or response

* transferSize: populated in response only from content-length header


## Tracked events

Window events

* page load

* page unload (before unload)

Performance timing events

* resource timing buffer is full

Detected

* URL change


## Database structure

All data is stored in IndexedDB database 'neut-dump'.

There are 2 key/value stores with a timestamp key, sorted by the key.

* timing: resource timing data
  * key: ts, Unix timestamp
  * value: event + page's performance metrics (https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)


* req: web request / responses
  * key: timestamp, Unix timestamp
  * value: web request or response (https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest)
