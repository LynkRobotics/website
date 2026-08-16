---
name: update-events
description: Update the upcoming events, competition dates or meeting times on the LYNK Robotics home page. Use when a competition is added, moved or cancelled, when the team qualifies for States or Worlds, or when meeting times change.
---

# Update the home page events

Everything is in `src/_data/events.json`. Nothing else needs touching.

## Meeting times

```json
"meetings": {
  "when": "Mon, Tues, Thurs, & Fri | 6:30-9 PM + Sat | 11:30 AM",
  "what": "Season Team Meetings",
  "where": "9496 LYNK Robotics HQ, 228 Callahan Koon Rd, Spindale, NC"
}
```

Free text — write it the way the team says it out loud.

## Competitions

```json
{
  "start": "2026-03-05",
  "end": "2026-03-07",
  "kind": "District Competition",
  "venue": "Heritage High School | Wake Forest, NC",
  "url": "https://frc-events.firstinspires.org/2026/NCWK2",
  "city": "Wake Forest, NC",
  "conditional": true
}
```

- **start / end** are ISO dates. The page formats them as "March 5 - March 7",
  so never hand-write the display text.
- **venue** is `Venue name | City, ST`. Get the state right — North Charleston
  is **SC**, not NC. That exact error was live on the old site for a season.
- **url** is the FIRST event page. The code is the last path segment, e.g.
  `SCCHA` for South Carolina Charleston, `NCPEM` for Pembroke. **Check the code
  matches the venue** — the old site had two of them swapped.
- **city** is used on the Invest page, where only the city is shown.
- **conditional: true** means "if we qualify". The first conditional event in
  the list is automatically preceded by the "Additional competition dates we'll
  attend, if we're able to qualify" note, so ordering matters: keep confirmed
  events first, conditional ones after.

## Qualifying

When the team qualifies for States or Worlds, drop `"conditional": true` from
that event. It moves above the note by itself. Do not rewrite the note.

## Verifying an event

Event codes and dates are on <https://frc-events.firstinspires.org/>. If you
have network access, fetch the URL and confirm it resolves to the right event
before saving it. A wrong link is invisible in a screenshot.

## Finish the job

Follow "Handing work back" in CLAUDE.md:

1. `npm run check`
2. `npm run review -- review.html --pages=/,/invest/` — events show on both
3. Publish `review.html` as an artifact and link it in your reply
4. Push a branch, open a pull request, and say a maintainer has to merge it

In your reply, list the dates as they will appear on the page so they can be
checked at a glance.
