---
name: add-sponsor
description: Add, move or remove a sponsor (investor) logo on the LYNK Robotics site. Use when a new business or family starts supporting the team, when a sponsor moves up a tier, or when one should come off.
argument-hint: "[sponsor name, if you know it]"
---

# Add or update a sponsor

The investor wall appears on the home page and on each season page, all from
one file: `src/_data/sponsors.json`. Editing it updates every page at once.

## Tiers

Tiers render top to bottom, largest logos first. They mirror the giving levels
on the Invest page:

| Tier in the file | Giving level | Logo size |
| --- | --- | --- |
| `Peak` | $15,000+ | `xl` |
| `Overlook` | $5,000–$15,000 | `lg` |
| `Trailhead` | $1,000–$5,000 | `md` |
| `Gorge` | up to $1,000 | `md` |
| `Supporters` | everyone else | `md` |

If you are told an amount but not a tier, work the tier out from the table and
say which one you picked, so it can be corrected.

## The entry

```json
{
  "name": "Acme Manufacturing",
  "logo": "/assets/img/sponsors/acme-manufacturing.png",
  "width": 540,
  "height": 210
}
```

- **width / height** are the logo's real pixel dimensions. They stop the page
  reflowing as logos load, so they must be accurate — read them off the file
  you saved, do not guess.
- **`"logo": null`** renders the sponsor as their name in text instead. Use it
  when there is no logo, as with `Moore Family`.
- **`"showName": true`** prints the name underneath a logo. Use it only when
  the logo alone does not say who they are, as with Thomas Jefferson Classical
  Academy.

## The logo file

Save to `src/assets/img/sponsors/<name-hyphenated>.png`, 540–700px wide.

- **PNG** if it needs transparency — most logos do.
- **JPEG** if it is a photographic or full-bleed logo with no transparency.
- Trim surrounding whitespace so logos in a row look optically similar in size.
- A logo on a white rectangle will show as a white box on the page. Ask for a
  transparent version if that is what you were given.

## Finish the job

Follow "Handing work back" in CLAUDE.md:

1. `npm run check`
2. `npm run review -- review.html --pages=/,/seasons/2025/` — the wall appears
   on both, and a mis-sized logo shows up in the row spacing
3. Publish `review.html` as an artifact and link it in your reply
4. Push a branch, open a pull request, and say a maintainer has to merge it

Check the screenshot before handing back: a logo that dwarfs its row, or
vanishes into the background, is the usual mistake and it is obvious on sight.
