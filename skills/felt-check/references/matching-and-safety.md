# Matching a felt report, and what to say about safety

## Time conversion

- The catalog is in UTC. People report local time.
- Convert the report to UTC before comparing, using the place's zone and the date's daylight saving rule.
- Watch the date. 9:01 PM Pacific Standard Time on Nov 19 is 05:01 UTC on Nov 20.
- `days` in `earthquakes_near` counts back from the present moment. Use a value that reaches back past the report with room to spare.
- List entries show origin time to the minute. `get_earthquake` shows it to the second.

## How close in time is a match

- Shaking reaches a person after the origin time. The strongest waves travel roughly 3 to 4 km per second, so the delay is a few seconds nearby and about half a minute at 100 km.
- People round clock times. "About 9" can mean ten minutes either side. "Just now" usually means the past five minutes.
- Treat a candidate within about five minutes of a careful report as a time match. For a vague report, list everything in the window.

## How close in space is a match

Whether a quake is felt depends on magnitude, depth, distance and the ground. As a rough guide only:

| Magnitude | Typically felt |
| --- | --- |
| Under 2 | Rarely, and only very close to the epicenter |
| 2 to 3 | Near the epicenter, as a brief jolt or rumble |
| 3 to 4 | Across a metropolitan area |
| 4 to 5 | Across a region, tens to a couple of hundred km |
| 5 and up | Hundreds of km, farther for deep events and in the central and eastern US |

Use the table to judge plausibility in words. Do not quote distances from it as limits. The tools do not return shaking intensity for a location.

The place text in a result is the epicenter's bearing from a town. Use the coordinates from `get_earthquake` when you need to reason about where the epicenter is relative to the person.

## Why a real earthquake may not show up

- **Not posted yet.** Automatic solutions usually appear within minutes, but small events and events outside dense networks can take longer.
- **Below the threshold.** The default `min_magnitude` is 2.5. Search with 1 or 0.
- **Outside the radius.** The circle filters by epicenter. A larger quake farther away needs a wider search.
- **Not in the USGS catalog.** Outside the United States, events under about magnitude 4.5 are often missing.
- **Later removed or merged.** An id seen earlier can disappear after review.

## What not to conclude

- "Nothing in the catalog" does not mean "no earthquake". Say what was searched.
- Do not name another cause, such as a truck, a blast, a sonic boom or a medical cause, as the explanation. You may say that non seismic sources exist and that the catalog cannot identify them.
- Do not predict what comes next. After a real earthquake, aftershocks are common and are usually smaller. The USGS publishes aftershock forecasts for some larger events on the event page.
- Zero felt reports does not mean nobody felt it.

## Safety wording

Use plain, short lines. Say them once. Do not lecture.

During shaking:

- Drop to hands and knees, take cover under sturdy furniture or protect your head and neck, and hold on until the shaking stops.

After strong shaking:

- Expect aftershocks.
- If you are hurt, smell gas, see fire or the building is damaged, get to a safe place and call the local emergency number. In the US that is 911.
- At the coast, if the shaking was strong or lasted a long time, move to high ground or inland at once without waiting for an alert. Then check https://www.tsunami.gov/ and local officials.
- Follow instructions from local emergency management.

What this plugin cannot do: issue or confirm warnings, assess a building, or tell anyone it is safe to go back inside.

## Official sources

- USGS event pages and "Did You Feel It?" reports: https://earthquake.usgs.gov/
- US earthquake preparedness and response guidance: https://www.ready.gov/earthquakes
- US tsunami alerts: https://www.tsunami.gov/
- Outside the US: the national seismological agency and civil protection authority.
