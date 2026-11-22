# Earthquake Watch

Turn “Was that an earthquake?” into a checkable USGS catalog result. Search near a place or across a worldwide feed, then open the event record for time, depth, magnitude, and the source link.

[Connect with Claude, ChatGPT, Muse Code, or Grok](PROVIDERS.md)

## Try it

- I felt shaking around 9 pm local time in Berkeley yesterday. Which catalog events fit that window?
- Show the most recent magnitude 4.5 or larger earthquakes worldwide and open the strongest of the returned events.

## Install in Claude

In Claude Code, run the following commands.

```text
/plugin marketplace add OpZero-sh/plugins
/plugin install earthquake-watch@opzero
```

In Claude chat or Cowork, open the installed plugin’s **Connectors** tab and connect the listed service. The hosted service uses public data and requires no sign in. Then ask a question or name a skill.

## Skills

Each skill is a set of written instructions that Claude loads when a request matches it. Reference notes sit beside each skill and are read only when needed.

- `quake-brief` lists recent earthquakes worldwide or within a radius of a place, states the magnitude threshold, window and limit it used, and opens the events that matter.
- `felt-check` takes "I felt shaking here around this time", searches the catalog near that place and time, and reports a likely match, several candidates, or that nothing cataloged fits.
- `event-record` opens one event by its USGS id and explains magnitude type, depth, review status, felt reports, alert level and the tsunami flag in plain language.

## Agent

In Cowork or Claude Code, the `event-match` agent handles harder matching: a vague time, a cluster of events, or several reports at once. It can call only the three read only tools of the service listed below.

This plugin has no hooks and starts no local process.

## Sources and coverage

All data is from the USGS Earthquake Hazards Program catalog and feeds, which are revised as analysts review events. New events are often automatic solutions whose magnitude, depth and location can change. Small events are cataloged well in parts of the United States and are often missing elsewhere. A radius search filters by epicenter. Felt reports, instrument magnitude, alert level, and the tsunami flag are separate fields. The plugin returns no shaking intensity, damage reports or forecasts.

This plugin is a catalog lookup, not a warning service. Nobody can predict earthquakes. The tsunami flag marks a region where a bulletin may be issued and is not an alert. For active tsunami alerts in the US, consult the U.S. Tsunami Warning System. In an emergency, call your local emergency number, 911 in the US, and follow local authorities.

[USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) · [U.S. Tsunami Warning System](https://www.tsunami.gov/) · [Ready.gov earthquake guidance](https://www.ready.gov/earthquakes)

## What this plugin runs, sends and fetches

The plugin connects Claude to one hosted service over HTTPS. A request carries only what the question needs: a latitude and longitude, a radius, a time window, a magnitude threshold or a USGS event id. The service reads USGS data on its side and states that requests are not stored.

- [earthquake-watch](https://earthquake-watch.mcp.opzero.sh/) at `earthquake-watch.mcp.opzero.sh` · [Privacy](https://earthquake-watch.mcp.opzero.sh/?page=privacy) · [Support](https://earthquake-watch.mcp.opzero.sh/?page=support)

The repository also holds files for other clients. The plugin never runs them. They do something only if you run them yourself from a checkout.

- `scripts/build_openai.py` reads files in this repository and writes a ZIP package to the folder you name. It makes no network request.
- `integrations/grok_example.py` prints a request preview when run with `--dry-run`. Without that flag it reads `XAI_API_KEY`, and `XAI_MODEL` if set, from your environment and sends your question and the service URL to the xAI API at `api.x.ai`.
- `integrations/grok-servers.json` and the `integrations/openai` folder are configuration read by those two scripts.

## In use

Examples from the connected services in Claude.

![USGS reports for earthquakes of magnitude 4.5 and higher](media/global-earthquakes.webp)
