# Neut dumper

Neut dumper collects raw performance data triggered by different events. Collected
data can be inspected in IndexedDB or exported to file.

## Collected data

* performance dumps

* browser properties

## Tracked events

Window events

* page load

* page unload (before unload)

* hash change (part after the #)

* history pop state

Performance timing events

* resource timing buffer is full

Heuristically detected

* URL change

Browser properties are dumped on next events:

* extension load

* database export

## Installation

Clone the repo and install neut-dump as extension. Supported browsers:

* Firefox

* Chrome

## Database structure

All data is stored in single database 'neut-dump'. Time series data is going into
'timeline' object store.

Each record in timeline has a timestamp, event name and event data.

## Export data
