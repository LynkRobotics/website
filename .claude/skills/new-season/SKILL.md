---
name: new-season
description: Create the season page for a new competition year on the LYNK Robotics site, or fill in results for the current one. Use at the start of a season, or after events when records, awards, robot details or the roster need updating.
argument-hint: "[year, e.g. 2026]"
---

# Add or update a season page

`/seasons/<year>/` is generated from one entry in `src/_data/seasons.json`.
There is no page template to create — add the entry and the page exists.

## Results must come from The Blue Alliance

**Never copy last year's block and edit the numbers, and never invent a
result.** The 2025 page originally shipped with 2024 records and links to 2024
events, because someone did exactly that.

The authoritative record is `https://www.thebluealliance.com/team/9496/<year>`.
It is server-rendered, so it can be read directly without an API key. Take:

- the official and overall record from the "Event Results" line
- each event's rank, record, awards and playoff outcome from its own block
- the event URL from that block — `https://www.thebluealliance.com/event/<key>`

If TBA states no playoff outcome for an event, leave `playoff` as `""`. The
template omits the line. Do not fill the gap with a guess.

## The entry

Copy the shape from an existing season, then replace every value:

- `year`, `name`, `robotName`, `game`, `gameVideo`, `gameSummary`
- `heroImage`, `robotImage`, `bannersImage`, `gameLogo`
- `buildLog` — `url`, `label` and an optional `note`
- `tba` — the team page for that year
- `summary` — the paragraph above the banners
- `robot` — `specs`, `record`, `capabilities[]`
- `eventsRecord` and `events[]`
- `roster[]`
- `gallery` — `{ "dir": "...", "count": N }`
- `sponsorsHeading` and `divider` — optional, both may be `null`

Put the newest season first in the file.

## Images

Into `src/assets/img/`, resized before committing — nothing in the build
resizes:

| What | Where | Size |
| --- | --- | --- |
| Hero | `hero/season-<year>.jpg` | 1400px wide |
| Robot | `hero/season-<year>-robot.jpg` | 1800px wide |
| Game logo | `seasons/<year>/<game>-logo.png` | 900px, transparent |
| Banners | `seasons/<year>/banners.jpg` | 1400px wide |
| Gallery | `seasons/<year>/gallery/01.jpg`, `02.jpg`, … | 1400px wide |

Gallery files must be numbered from `01` with no gaps, and `gallery.count` must
match how many there are — the template counts up to it, so a mismatch shows as
a broken image.

## Add it to the menu

A new season does not appear in the navigation on its own. Add it to the
`Seasons` dropdown in `src/_data/site.json`, newest first.

## Finish the job

Follow "Handing work back" in CLAUDE.md:

1. `npm run check`
2. `npm run review -- review.html --pages=/seasons/<year>/`
3. Publish `review.html` as an artifact and link it in your reply
4. Push a branch, open a pull request, and say a maintainer has to merge it

In your reply, list each event with its record and awards, and say you took
them from The Blue Alliance, so the numbers can be spot-checked.
