# Event fields in depth

## Contents

- The record as returned
- Magnitude types
- Magnitude versus intensity
- Depth
- Status: automatic and reviewed
- Felt reports
- Alert level (PAGER)
- Tsunami flag
- Event ids
- What the record leaves out

## The record as returned

A `get_earthquake` result, read live from the `usgs` server (Earthquake Watch):

```text
M 6.7 - 9 km NE of Carhuamayo, Peru
  Magnitude: 6.7 mww
  Time (UTC): 2026-11-21 00:09:19
  Location: -10.8548, -75.9779
  Depth: 107.991 km
  Felt reports: 123
  Alert level: green
  Tsunami flag: yes
  Status: reviewed
  https://earthquake.usgs.gov/earthquakes/eventpage/us6000ucfm
```

The footer reads `A tsunami flag means the event was in a region where a tsunami bulletin may be issued; it does not mean a tsunami occurred.`

Location is latitude then longitude. Negative latitude is south and negative longitude is west. Regional networks can return long decimals, such as a depth of `15.1099996566772 km`. Round to one decimal at most. The extra digits are not precision.

## Magnitude types

The letters after the magnitude name the method. Seen live: `mww` and `md`.

| Type | Name | Typical use |
| --- | --- | --- |
| `mww`, `mwc`, `mwb`, `mwr`, `mw` | Moment magnitude, by different methods | The standard for moderate and large earthquakes. `mww` uses the W phase |
| `mb` | Body wave magnitude | Moderate events recorded at a distance, often the first estimate |
| `ms` | Surface wave magnitude | Shallow moderate to large events |
| `ml` | Local magnitude, the original Richter method | Small to moderate events recorded nearby |
| `md` | Duration magnitude | Small local events, from how long the shaking lasts on the record |

What to tell people:

- All of these aim at the same scale, so a 4.5 is a 4.5 whichever letters follow. They can still differ by a few tenths for one event.
- A preliminary magnitude often changes when a moment magnitude is computed or an analyst reviews the event. A change from 5.9 to 5.6 is ordinary revision.
- "Richter scale" is common shorthand. For large events the figure is a moment magnitude.
- The scale is logarithmic. One whole unit is about 10 times the recorded ground motion and about 32 times the energy released.

## Magnitude versus intensity

- **Magnitude** describes the earthquake at its source. One event, one value.
- **Intensity** describes shaking at a place, on the Modified Mercalli scale from I to X and above. One event has many intensities.
- The server returns magnitude only. For intensity, send the reader to the ShakeMap and "Did You Feel It?" maps on the USGS event page.

Never translate a magnitude into "how bad it was" for a named town. Distance, depth, ground conditions and building quality decide that.

## Depth

Depth is where the rupture started, in km below the surface. The USGS groups depths as:

| Class | Depth |
| --- | --- |
| Shallow | 0 to 70 km |
| Intermediate | 70 to 300 km |
| Deep | 300 to 700 km |

- Shallow earthquakes cause the strongest shaking near the epicenter.
- Intermediate and deep earthquakes are felt over a wider area with less intense shaking for the same magnitude.
- Depth is the least certain part of an early solution. A round value such as 10 km on a new event is often a default the network assigned, not a measurement.

## Status: automatic and reviewed

| Status | Meaning |
| --- | --- |
| `automatic` | Produced by software from the first data. Not yet checked by a person |
| `reviewed` | Checked by a seismologist |

Automatic solutions can change in every field, and a few are later deleted as false or merged with another network's solution. Say "preliminary" when the status is automatic.

## Felt reports

The count of responses submitted to the USGS "Did You Feel It?" system for this event.

- It depends on how many people live nearby, the time of day and internet access, as much as on the shaking.
- It rises for hours or days after an event.
- Zero reports does not mean the quake was not felt. A high count does not mean it was damaging.
- In list results the line appears only when the count is above zero.

## Alert level (PAGER)

PAGER is the USGS system that estimates the scale of impact, in fatalities and economic losses, soon after a significant earthquake.

| Level | Meaning |
| --- | --- |
| `green` | Little or no impact expected |
| `yellow` | Some impact possible, local or regional response |
| `orange` | Significant impact likely, national response |
| `red` | Extensive impact likely, international response |
| `none` | No PAGER estimate was produced. Usual for small events |

It is an estimate made from models of shaking, population and building types. It is not a warning, not an instruction to the public, and not a count of actual losses.

## Tsunami flag

- `yes` means the event occurred in a region where a tsunami bulletin may be issued. The USGS sets it for larger events in oceanic regions.
- It does not say that a tsunami was generated, observed or warned of. In the live record above, the flag was `yes` for an inland event about 108 km deep.
- `no` is not an all clear either.
- Tsunami alerts come from tsunami warning centers. For the US: https://www.tsunami.gov/. Elsewhere: the national warning center.

If someone at the coast has just felt strong or long shaking, the guidance from warning centers is to move to high ground or inland without waiting for an alert.

## Event ids

- An id is a short network code, usually two letters, followed by that network's event code: `us6000ucfm` from the USGS national network, `nc75468647` from the Northern California network.
- The event page is `https://earthquake.usgs.gov/earthquakes/eventpage/<id>`.
- One earthquake can have ids from several networks. The catalog shows the preferred one, which can change after review.

## What the record leaves out

Not returned by this server, and available on the USGS event page for many events:

- ShakeMap and intensity at a location
- "Did You Feel It?" maps
- The fault mechanism and tectonic summary
- Aftershock forecasts
- The history of revisions

Not available from the USGS at all: confirmed damage and casualty figures. Those come from local authorities.

## Official sources

- USGS Earthquake Hazards Program: https://earthquake.usgs.gov/
- US tsunami alerts: https://www.tsunami.gov/
- US preparedness and response guidance: https://www.ready.gov/earthquakes
