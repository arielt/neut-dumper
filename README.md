# Neut dumper

Neut dumper collects raw performance data triggered by different events. Collected
data can be inspected in IndexedDB or downloaded as a file.


## Installation

Clone the repo and install neut-dump as extension. Supported browsers:

* Firefox

* Chrome


## Operations

To get the data stored in the database, open extension UI and click download.
It will download the database in JSON format under the name 'neut-dump-timeseries.json'.

To clear database, click Clear.


## Collected data

Each entry represents recorded event:

* ts: unique timestamp

* type: see Tracked events

* windowId, tabId: IDs used by browser

* location: location(URL) data

* performance: snapshot of page performance metrics (https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)


## Tracked events

Window events

* page load

* page unload (before unload)

Performance timing events

* resource timing buffer is full

Detected

* URL change


## Database structure

All data is stored in single database 'neut-dump'. Time series data is going into
'timeline' object store.
