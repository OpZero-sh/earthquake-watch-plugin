---
name: event-record
description: "Opens one USGS earthquake record by event id and explains each field in plain language: magnitude and its type, origin time, depth, coordinates, felt reports, PAGER alert level, tsunami flag and whether the solution is automatic or reviewed. Use when someone shares a USGS event id or event page link, asks for details on a specific earthquake in the news, or asks what mww, depth, alert level, tsunami flag or reviewed status means."
---

# Event record

Read one event from the USGS catalog and say what each field means, what it does not mean, and what could still change.

## When to use

- "Tell me about us6000ucfm."
- "What do we know about the magnitude 6.7 in Peru yesterday?"
- "The USGS page says tsunami flag yes. Is there a tsunami?"
- "Why did the magnitude change from 5.9 to 5.6?"

Use `quake-brief` to list events and `felt-check` to match shaking someone felt. This skill explains a record. It does not report damage, casualties or shaking intensity, because the server returns none of them.

## Tools

All are on the `usgs` server (Earthquake Watch).

| Tool | Use it for |
| --- | --- |
| `get_earthquake` | The record for one `event_id` |
| `recent_earthquakes` | Finding the id of a large event described by date and region |
| `earthquakes_near` | Finding the id of an event described by place, including smaller ones |

In Claude Code the full tool names follow the pattern `mcp__plugin_earthquake-watch_usgs__get_earthquake`.

## Workflow

1. **Get the id.**
   - From a link: the id is the last path segment of `https://earthquake.usgs.gov/earthquakes/eventpage/<id>`.
   - From a description: search first. For a large event use `recent_earthquakes` with `magnitude: "significant"` or `"4.5"` and a `period` that covers the date. For a place use `earthquakes_near`. If two events fit the description, name both and ask which, or open both.
2. **Open it.** Call `get_earthquake` with the id.
3. **Explain** the fields in the order below, in plain words, with the caveats that apply to this event.
4. **Link** the USGS event page. It carries the maps, shaking estimates and updates this plugin does not.

## What the record holds

| Field | Say this | Do not say |
| --- | --- | --- |
| `Magnitude` and type, such as `6.7 mww` | The size of the earthquake at its source, and the method used | That it measures shaking at any place |
| `Time (UTC)` | When the rupture began. Add the local time at the epicenter and for the reader | |
| `Location` | Latitude and longitude of the epicenter | |
| `Depth` | How far below the surface the rupture began, rounded to a sensible figure | The raw value with a dozen decimals |
| `Felt reports` | How many people sent a report to the USGS | That it counts people affected |
| `Alert level` | The USGS PAGER estimate of impact, or `none` when no estimate was made | That it is a warning or an instruction |
| `Tsunami flag` | Whether the event was in a region where a tsunami bulletin may be issued | That a tsunami happened or is coming |
| `Status` | `automatic` is a computer solution. `reviewed` has been checked by a seismologist | That automatic values are final |

Magnitude types, depth classes, the PAGER colors and the exact meaning of the tsunami flag are in [references/event-fields.md](references/event-fields.md).

## Points that matter most

- **Magnitude is not intensity.** One earthquake has one magnitude and many intensities, which fall with distance and vary with ground conditions. This plugin has no intensity data. The event page's ShakeMap does.
- **Depth changes the effect.** A shallow quake shakes the area above it harder than a deep one of the same magnitude. A deep quake is felt more widely and more gently.
- **Numbers get revised.** An automatic solution can change in magnitude, depth and position, and different agencies can publish different magnitudes for the same event.
- **The tsunami flag is not an alert.** The server repeats this under every record. For alerts, send the person to https://www.tsunami.gov/ in the US or their national warning center.

## Edge cases

- **Unknown id.** `No USGS event with id <id>.` Check for a typing error, then search by place and date. Events are sometimes merged under another network's id.
- **Very recent event.** Expect `Status: automatic`, zero felt reports and `Alert level: none`. Say these often fill in or change over the following hours.
- **Questions about damage, deaths or aftershocks.** The record has none of that. Link the event page and say that local authorities and news reports are the source for impact.
- **Someone affected by the event.** Be plain and kind. Give the facts and the official sources. Do not speculate about casualties or what will happen next.

## Answer shape

```text
M 6.7, 9 km NE of Carhuamayo, Peru
When: 2026-11-21 00:09:19 UTC, which is 7:09 PM Fri Nov 20 in Peru
Where: 10.85 S, 75.98 W, about 108 km deep (intermediate depth)
Magnitude type: mww, a moment magnitude
Status: reviewed by a seismologist
Felt reports sent to the USGS: 123
PAGER alert level: green, the lowest impact estimate
Tsunami flag: yes. This marks a region where a bulletin may be issued. It does not mean a tsunami occurred.
More: https://earthquake.usgs.gov/earthquakes/eventpage/us6000ucfm
```

## Limits to state

The record is the USGS catalog entry at the moment of the call. It can change. It holds no shaking map, no damage or casualty information, no fault mechanism and no forecast. The USGS event page has the first, third and sometimes the fourth. Impact information comes from local authorities.

## Examples

**"What does status automatic mean on nc75468647?"** Open the record. Explain that a computer produced the solution, no seismologist has reviewed it yet, and its magnitude of 2.24 md and its location may be adjusted.

**"The 6.7 in Peru says tsunami yes. Should people evacuate?"** Open the record, explain the flag using the server's own caveat, note the 108 km depth and inland location as facts from the record, and send the person to their national tsunami warning center and local authorities for any alert. Do not make the call.

**"Details on yesterday's big quake near Timor."** Call `recent_earthquakes` with `magnitude: "significant"`, `period: "week"`, find the event, then open it with `get_earthquake`.
