---
name: quake-brief
description: "Lists recent earthquakes worldwide or near a place from the USGS catalog and summarizes them with magnitude, time, location and source links. Use when someone asks about recent earthquakes, the latest or biggest quake today or this week, earthquakes near a city or within a radius, seismic activity in a region over the past weeks or months, or significant earthquakes this month."
---

# Quake brief

Answer "what earthquakes have there been" for the world or for a place, with the search settings stated so the reader knows what the list does and does not cover.

## When to use

- "Any big earthquakes today?"
- "Earthquakes near Anchorage in the last month."
- "How active has the area around Naples been this year?"

Use `felt-check` when the person felt shaking and wants to know what it was. Use `event-record` to explain one event in detail. This skill does not predict earthquakes, forecast aftershocks, or give shaking intensity at a location, because the server returns none of those.

## Tools

All are on the `usgs` server (Earthquake Watch).

| Tool | Arguments that matter | Returns |
| --- | --- | --- |
| `recent_earthquakes` | `magnitude`: `significant`, `4.5`, `2.5`, `1.0` or `all` (default `4.5`); `period`: `hour`, `day`, `week` or `month` (default `day`); `limit` 1 to 50 (default 15) | Worldwide events from the USGS feed, newest first, with the total count |
| `earthquakes_near` | `latitude`, `longitude` (required); `radius_km` 1 to 2000 (default 300); `days` back 1 to 365 (default 30); `min_magnitude` 0 to 10 (default 2.5); `limit` 1 to 50 (default 15) | Events whose epicenter lies inside the circle, newest first |
| `get_earthquake` | `event_id`, for example `us6000ucfm` | One event's magnitude and type, time, coordinates, depth, felt reports, alert level, tsunami flag and review status |

In Claude Code the full tool names follow the pattern `mcp__plugin_earthquake-watch_usgs__recent_earthquakes`.

## Workflow

1. **Worldwide or local?** No place named: `recent_earthquakes`. A place named: `earthquakes_near` with that place's latitude and longitude. State the coordinates you used.
2. **Set the thresholds on purpose.**
   - Worldwide "big ones": `magnitude: "significant"` with `period: "week"` or `"month"`, or `"4.5"` with `"day"`.
   - Local "anything nearby": lower `min_magnitude` to 1.0 or 0 inside the United States. The default of 2.5 hides most small local events.
   - Regional activity over time: raise `days` and `limit`, and keep `min_magnitude` at a level the catalog covers well for that region.
3. **Call the tool.** Read the header line first. It restates the threshold, radius, start date and count.
4. **Check for truncation.** `recent_earthquakes` says `11 events, showing the latest 5`. `earthquakes_near` gives no total: its header counts only the events returned. When that count equals `limit`, assume more exist. Raise `limit` to 50, or raise `min_magnitude`, or shorten `days`, and say what you did.
5. **Open the events that matter.** Call `get_earthquake` for the largest or the one asked about to add depth, magnitude type, review status and the tsunami flag.
6. **Report** in the shape below.

## Reading the results

- **Times are UTC.** Convert to the person's or the place's local time and show both.
- **The place text**, such as `9 km NE of Carhuamayo, Peru`, locates the epicenter relative to a named town. It is not the distance from the search point.
- **Radius searches filter by epicenter.** A large quake centered just outside the circle is not listed even if it was felt inside it.
- **`Felt reports`** appears only when people submitted reports. Its absence does not mean nobody felt the quake.
- **`Significance`** is a USGS score, not a magnitude. The `significant` feed is chosen by it, so a widely felt moderate quake can appear while a larger remote one does not.
- **Automatic versus reviewed.** New events are often automatic solutions. Magnitude, location and depth can change, and an event can be removed.

Feed choices, catalog coverage and default pitfalls are in [references/feeds-and-search.md](references/feeds-and-search.md).

## Edge cases

- **Nothing found.** The tool returns a sentence such as `No earthquakes of M4+ within 30 km of 33.75, -84.39 since 2026-11-19.` Repeat the window, radius and threshold, and say the result applies only to them. Offer to widen.
- **Unknown event id.** `get_earthquake` returns `No USGS event with id <id>.` The event may have been removed or merged. Search again.
- **A tsunami question.** The tsunami flag is not a warning. Send the person to https://www.tsunami.gov/ and local authorities for alerts.
- **"Will there be another one?"** Say that nobody can predict earthquakes. The USGS publishes aftershock forecasts for some larger events on its event pages. Link the event page.
- **Someone in an affected area asking what to do.** Give the facts from the record, then point to local emergency services and official guidance. Do not assess their safety or their building.

## Answer shape

For a list:

```text
M4.5+ worldwide, past day (USGS feed): 11 events, 5 shown
  M5.4  9 km N of Carhuamayo, Peru   2026-11-22 21:35 UTC   us6000ucuf
  M4.7  25 km WSW of Isangel, Vanuatu   2026-11-22 20:54 UTC   us6000ucu7
  ...
Largest shown: M5.4 near Carhuamayo, Peru, with the depth and review status from get_earthquake
Search settings: magnitude feed 4.5, period day, limit 5
Source: USGS Earthquake Hazards Program, with the event page links
```

Always state the settings. Add local time when the question is about one place. Link the USGS event page for any event you describe.

## Limits to state

The catalog is revised as analysts review events. Small events are cataloged well in parts of the United States and poorly in much of the world, so an empty list of small quakes abroad is weak evidence. The tools return no shaking intensity, damage reports, casualty figures or forecasts.

## Examples

**"Any big earthquakes today?"** Call `recent_earthquakes` with `magnitude: "4.5"`, `period: "day"`. Give the count, list the largest few, and open the largest with `get_earthquake`.

**"Earthquakes near Berkeley this week?"** Call `earthquakes_near` for 37.87, -122.27 with `radius_km: 50`, `days: 7`, `min_magnitude: 1`. Report the count and each event, and note that these are small events from the regional network.

**"Show significant earthquakes this month and open the strongest."** Call `recent_earthquakes` with `magnitude: "significant"`, `period: "month"`, `limit: 50`. Find the largest magnitude in the list and call `get_earthquake` with its id.
