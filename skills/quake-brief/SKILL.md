---
name: quake-brief
description: "Look up recent earthquakes worldwide or near a location and interpret individual USGS event reports."
---

# Earthquake Watch

Choose `recent_earthquakes` for worldwide feeds and `earthquakes_near` for a place. A worldwide feed accepts an hour, day, week, or month and a magnitude category. A local search takes coordinates, radius in kilometers, days back, and minimum magnitude. State the selected thresholds and what they cover.

For a felt-time question, resolve the local calendar date and time zone first. Search near the stated location, then compare returned UTC event times with the user's approximate time. Give promising records' IDs to `get_earthquake`. Keep a plausible match tentative. If several fit, present them together. Use the count and limit returned by the tool before describing a list as exhaustive.

In a detailed brief, include event ID and USGS link, magnitude and scale when returned, depth in km, exact time with zone, and catalog status. Treat felt reports as counts of submitted reports. A positive tsunami flag indicates a possible bulletin region. Verify an actual active warning with the responsible warning center. An empty result applies to the search window, radius, and threshold used.
