# Feeds, searches and coverage

Every output form below was read from live results of the `usgs` server (Earthquake Watch). The data comes from the USGS Earthquake Hazards Program.

## `recent_earthquakes`: the worldwide feeds

| `magnitude` | What the feed holds |
| --- | --- |
| `significant` | Events the USGS ranks as significant by its significance score |
| `4.5` | Magnitude 4.5 and larger |
| `2.5` | Magnitude 2.5 and larger |
| `1.0` | Magnitude 1.0 and larger |
| `all` | Every cataloged event |

| `period` | Window |
| --- | --- |
| `hour` | Past hour |
| `day` | Past day |
| `week` | Past 7 days |
| `month` | Past 30 days |

- The header reads like `M4.5+ earthquakes, past day: 11 events, showing the latest 5.` The first number is the total in the feed. The second is how many the `limit` let through.
- Events are listed newest first. The newest are not the largest. To find the largest, raise `limit` to 50 and compare magnitudes, or use a higher magnitude feed.
- An empty feed reads `Significant earthquakes, past hour: 0 events.`
- There is no place filter. For a place, use `earthquakes_near`.

Choosing a feed:

| Question | Feed and period |
| --- | --- |
| Anything notable right now | `4.5`, `day` |
| The major events lately | `significant`, `week` or `month` |
| Is the world unusually active | `4.5`, `week`, and report the count without calling it unusual. The tools give no baseline |
| Small events | Use `earthquakes_near`. The `1.0` and `all` feeds are dominated by a few dense networks |

## `earthquakes_near`: the local search

- The header reads like `4 earthquakes of M1+ within 50 km of 37.87, -122.27 since 2026-11-15.` It restates every setting. Quote it.
- `days` counts back from now. To cover an event N days ago, set `days` to at least N plus 1.
- The circle is drawn around the coordinates you pass and filters by epicenter.
- Events are newest first, up to `limit`. The count in the header is the number returned, not the total. In one check the same search read `4 earthquakes` with a limit of 5 and `2 earthquakes` with a limit of 2. If the number returned equals `limit`, treat the list as cut off.
- No results reads `No earthquakes of M4+ within 30 km of 33.75, -84.39 since 2026-11-19.`

Defaults that surprise people:

| Default | Effect | Fix |
| --- | --- | --- |
| `min_magnitude` 2.5 | Small felt quakes do not appear | Use 1.0 or 0 in well instrumented regions |
| `radius_km` 300 | A city search pulls in events far away | Use 50 to 100 for "near me" |
| `days` 30 | Older events are left out | Raise up to 365 |
| `limit` 15 | Busy regions are cut off | Raise up to 50 and narrow the other settings |

## Fields in a list entry

| Line | Meaning |
| --- | --- |
| `M5.4 9 km N of Carhuamayo, Peru (2026-11-22 21:35 UTC)` | Magnitude, place text, origin time in UTC to the minute |
| `Event id` | USGS id, a network code followed by the network's event code, such as `us6000ucuf` or `nc75468647` |
| `Felt reports` | Number of reports people submitted. Shown only when there are some |
| `Significance` | USGS significance score. Larger means more notable. It combines magnitude with felt reports and estimated impact |
| Link | The USGS event page |

Offshore and remote events can have place text without a distance, such as `south of the Fiji Islands`.

## Catalog coverage

- The catalog combines the USGS national network with regional networks. Inside the United States, especially California, Alaska, Hawaii and other instrumented regions, events below magnitude 2 are cataloged. The `nc` ids seen near Berkeley are from the Northern California network.
- Outside the United States the USGS aims to report events of about magnitude 4.5 and larger. Smaller events abroad are often absent.
- So: "no events of M2+ near a town in the US" is fairly good evidence. "No events of M2+ near a town abroad" is not. Say which case applies.

## Revisions

- New events usually arrive as automatic solutions and are later reviewed by a seismologist. Magnitude, depth and location can change.
- Events can be merged or deleted. An id that worked earlier can stop working.
- The server does not state how often it refreshes its data. Quote event times, not an assumed delay.

## Describing activity without overreaching

- Give counts and the largest magnitude for the stated window. Do not call activity normal, elevated or a swarm unless a USGS statement on the event page says so.
- More small events in a list can reflect a denser network or a lower threshold, not more earthquakes.
- Magnitude is logarithmic. One whole unit is about 10 times the recorded amplitude and about 32 times the energy. Do not average magnitudes.

## Official sources

- USGS Earthquake Hazards Program: https://earthquake.usgs.gov/
- Tsunami alerts for the US: https://www.tsunami.gov/
