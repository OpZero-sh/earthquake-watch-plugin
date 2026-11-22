---
name: felt-check
description: "Checks whether shaking someone felt matches an earthquake in the USGS catalog, by searching near their location around the time they report and comparing candidates. Use when someone says was that an earthquake, did we just have an earthquake, I felt the house shake, my bed was shaking last night, or asks what the tremor they felt at a certain time was."
---

# Felt check

Turn "I felt shaking around this time in this place" into a checked catalog answer: a match, several candidates, or an honest "nothing in the catalog for that window".

## When to use

- "Was that an earthquake? Berkeley, about two minutes ago."
- "I felt the house shake around 9 pm last night in Tulsa."
- "Did anyone else feel that in Anchorage this morning?"

Use `quake-brief` for general "recent earthquakes" questions and `event-record` to explain a known event. This skill cannot say what else the shaking was, and it cannot judge whether a building is safe.

## If the person may be in danger

Deal with this before any lookup. If they describe strong shaking still under way, injuries, a gas smell, structural damage, or being near the coast after strong or long shaking, say this first and briefly:

- During shaking: drop, cover and hold on.
- Injuries, fire, gas or a damaged building: call the local emergency number, 911 in the US.
- At the coast after strong or long shaking: move to high ground or inland now. Do not wait for an official alert.

Then offer the lookup. Do not delay the safety lines to finish a search.

## Settle these first

1. **Where.** A town or neighborhood is enough. Work out latitude and longitude and state them.
2. **When.** A local clock time and date, even approximate. "Just now" means the past few minutes. Ask only if you have neither a time nor "just now".
3. **Time zone.** Take it from the place. Convert the reported time to UTC and keep the date straight when the conversion crosses midnight.

## Tools

All are on the `usgs` server (Earthquake Watch).

| Tool | Use it for |
| --- | --- |
| `earthquakes_near` | Events around the person's location in a window that covers the reported time |
| `get_earthquake` | The full record for each plausible candidate |
| `recent_earthquakes` | A fallback check for a large distant event when nothing local turns up |

In Claude Code the full tool names follow the pattern `mcp__plugin_earthquake-watch_usgs__earthquakes_near`.

## Workflow

1. **Search close and small first.** Call `earthquakes_near` with the location, `radius_km: 100`, `min_magnitude: 1`, and `days` set to cover the reported time with a day to spare. `days` counts back from now, so use 1 for "just now" and 2 for "last night".
2. **Compare times.** Each result shows origin time in UTC. Convert to the person's local time. A candidate fits when it falls within a few minutes of the reported time. Allow a wider margin when the person was unsure or asleep.
3. **Widen if nothing fits.** Search again with `radius_km: 500` and `min_magnitude: 3.5`. Larger quakes are felt much farther away. If that is empty too, call `recent_earthquakes` with `magnitude: "4.5"` and `period: "day"` to catch a large distant event.
4. **Open the candidates.** Call `get_earthquake` for each plausible event, up to three. Read magnitude and type, depth, review status and felt reports.
5. **Judge plausibility in words, not numbers.** A magnitude 2 centered 5 km away fits a brief jolt. A magnitude 2 centered 90 km away does not explain strong shaking. Say which way the evidence leans and why.
6. **Answer** in the shape below. Keep a single match tentative unless time, place and size all agree.

## Reading the results

- **Origin time is when the rupture started**, not when the person felt it. Shaking arrives later with distance, roughly half a minute per 100 km for the strongest waves. Close events arrive within seconds.
- **The place text** such as `3 km NNE of Pleasant Hill, CA` is the epicenter relative to that town, not relative to the person. Do not turn it into a distance from them unless the town is their own.
- **`Status: automatic`** means no seismologist has reviewed the event yet. Magnitude and location may change in the next hours.
- **`Felt reports`** counts reports people sent to the USGS. Zero on a fresh or small event is normal.

Matching rules, reasons a real quake may be missing, and the safety wording to use are in [references/matching-and-safety.md](references/matching-and-safety.md).

## Edge cases

- **Nothing in the catalog.** Say that no cataloged event fits the window, radius and threshold you searched, and name them. Add that a very recent or very small event may not be posted yet, and offer to check again in a few minutes. Do not suggest other causes as fact.
- **Several candidates.** Present them together with times and sizes. Aftershock sequences and swarms produce many events minutes apart.
- **The time is vague.** "Sometime last night" gets a list of every event in that night's window, not a single match.
- **Outside the United States.** Small events are often not in the USGS catalog. Say so, and suggest the national seismological agency for the country.
- **The person is frightened.** Stay factual and brief. Give what the record shows, what is not yet known, and where official guidance lives.

## Answer shape

```text
Likely match: M2.2, 3 km NNE of Pleasant Hill, CA
Origin time: 2026-11-20 05:01:56 UTC, which is 9:01 PM PST Thu Nov 19
Your report: about 9 pm in Berkeley, so within a couple of minutes
Depth 15.1 km, magnitude type md, status automatic (not yet reviewed, may change)
Felt reports: 0 so far
Why it fits: time agrees and the epicenter is in the East Bay
Searched: 100 km around 37.87, -122.27, M1+, past 2 days
USGS event page: https://earthquake.usgs.gov/earthquakes/eventpage/nc75468647
You can add your own report on that page under "Did You Feel It?"
```

When nothing fits, replace the first lines with "No cataloged event fits" and keep the `Searched` line.

## Limits to state

This is a catalog lookup. It confirms that an earthquake was recorded near a time and place. It cannot confirm what one person felt, rule out other causes, predict aftershocks, or assess damage. The USGS and local emergency management are the sources for anything that affects safety.

## Examples

**"Was that an earthquake? I'm in Berkeley."** Search 100 km around 37.87, -122.27 with `min_magnitude: 1`, `days: 1`. If an event from the past few minutes appears, open it and report it as a likely match with its automatic status. If not, say nothing is posted yet and offer to look again shortly.

**"I felt shaking around 9 pm last night in Berkeley."** Convert 9 pm Pacific to UTC, which falls on the next UTC date. Search with `days: 2`. Compare each origin time with the report and open the closest.

**"Big shake in Anchorage, things fell off shelves."** Lead with the safety lines, since this describes strong shaking near a coast. Then search, open the largest recent event, and link the USGS event page and https://www.tsunami.gov/.
