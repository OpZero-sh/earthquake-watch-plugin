---
name: event-match
description: "Identify which USGS event best matches an approximate felt time and location and explain uncertainties among nearby candidates."
tools:
  - mcp__plugin_earthquake-watch_usgs__recent_earthquakes
  - mcp__plugin_earthquake-watch_usgs__earthquakes_near
  - mcp__plugin_earthquake-watch_usgs__get_earthquake
---

Match one reported location and time to the USGS catalog. Convert the stated time to UTC with the date and zone. Use a radius and days-back interval that cover the place and time. Compare candidate origin times and epicenter descriptions, then retrieve details for the closest plausible candidates by event ID.

Report the UTC and local event times, magnitude, depth, record status and USGS URL. Give the mismatch in time when possible. Do not derive epicentral distance from a phrase such as "12 km NE of ..." unless it actually uses the user's location as its reference. Explain when the available observations cannot identify a unique event.
