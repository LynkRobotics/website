# LYNK Robotics website — working notes for Claude

This repository is the source for **lynkrobotics.org**, the website of LYNK
Robotics (FIRST Robotics Competition Team 9496), which operates under Inspire
Carolina, Inc.

It is a static site built with [Eleventy](https://www.11ty.dev/) and published
to GitHub Pages by a GitHub Action. There is no server and no database.

## The rule that matters most

**Content lives in `src/_data/*.json`, not in templates.** Before editing a
template, check whether the change is really a data change. Adding a mentor,
a sponsor, a competition or a season should never require touching HTML.

| To change this            | Edit this                             |
| ------------------------- | ------------------------------------- |
| Site name, nav, contact info, social links, PayPal/Chief Delphi/Drive URLs | `src/_data/site.json` |
| Mentors (the Mentors page)| `src/_data/mentors.json`              |
| The two co-lead contacts  | `src/_data/leads.json`                |
| Sponsor logos and tiers   | `src/_data/sponsors.json`             |
| Upcoming events on the home page | `src/_data/events.json`        |
| FAQ questions and answers | `src/_data/faqs.json`                 |
| Testimonials on /experiences/ | `src/_data/experiences.json`      |
| A whole season (robot, results, roster) | `src/_data/seasons.json`|
| Old URLs that must keep working | `src/_data/redirects.json`      |

## Layout of the repository

```
src/
  _data/         content as JSON — see the table above
  _includes/
    layouts/base.njk        the page shell (head, header, footer)
    partials/               header, footer, social icons, sponsors, leads, video
  assets/
    css/site.css            all styling; design tokens live at the top
    css/fonts.css           self-hosted @font-face rules (do not hand-edit)
    fonts/                  Red Hat Display + Roboto woff2 files
    img/                    all imagery, grouped by page/purpose
    js/site.js              mobile nav + click-to-load YouTube. Nothing else.
  *.njk                     one file per page
  seasons/season.njk        generates /seasons/<year>/ for every entry in seasons.json
  redirect.njk              generates a stub for every entry in redirects.json
.claude/skills/            /add-mentor, /add-sponsor, /update-events, /new-season
scripts/check-links.mjs     fails the build on a broken internal link
scripts/mark-preview.mjs    turns a build into a badged, noindexed preview
scripts/review-shots.mjs    screenshots the site into a single review page
.github/CODEOWNERS          maintainers own every file; gates PR approval
.github/workflows/          deploy (on main) and build check (on PRs)
```

## Commands

```bash
npm install       # once
npm start         # local preview at http://localhost:8080 with live reload
npm run build     # write the site to _site/
npm run check     # build, then verify every internal link resolves
npm run review    # build, screenshot every page, write review.html
```

Always run `npm run check` before handing work back. It catches the most
common breakage: a page renamed in one place but still linked from another.

## Handing work back

**The reviewer must never have to run anything.** Finish every change that
finished this way:

1. `npm run check` — the build passes and no internal link is broken.
2. `npm run review -- review.html --pages=/faqs/,/our-people/` — screenshots
   the pages the change touched, at desktop and phone width, into one
   self-contained file. List only the affected pages; omit `--pages` to capture
   the whole site.
3. Publish `review.html` as an artifact and put the link in your reply.
4. Push the branch and open a pull request — never push to `main`, which is
   protected. Fill in `.github/pull_request_template.md`; it prompts for the
   pages affected, which is what a reviewer needs. Cloudflare comments a live,
   clickable preview URL on the PR within a minute or so.

So the reviewer gets two things without lifting a finger: screenshots in the
reply for an immediate look, and a real browsable site on the PR.

Keep `review.html` under about 14 MB or the artifact will not publish — that is
roughly 12 pages. Use `--pages` and it will not come close.

`npm run review` needs Playwright and a Chromium build; both are already
present in Claude Code environments.

## House style

- **Design tokens first.** Colours, fonts and spacing are CSS custom properties
  at the top of `site.css`. The brand orange is `#BF5700` (`--orange`) and the
  near-black is `#1C1C1C` (`--ink`). Use the tokens; do not paste hex values
  into rules.
- **Section variants** do the heavy lifting: `.section--dark`, `.section--orange`,
  `.section--alt`, `.section--center`, `.section--tight`. Compose these rather
  than writing new one-off section styles.
- **Every image needs a real `alt`**, except purely decorative ones, which take
  `alt=""`. Hero background images are decorative.
- **Every image below the fold gets `loading="lazy"`** and explicit
  `width`/`height` so the page does not jump while it loads.
- **Links that leave the site** get `rel="noopener" target="_blank"`.
- **No third-party requests on page load.** Fonts are self-hosted, YouTube is
  click-to-load, social icons are inline SVG. Keep it that way — adding a CDN
  script or a Google Fonts link would undo this.

## Adding things

Four project skills in `.claude/skills/` cover the common jobs and encode the
gotchas — event codes matching venues, sponsor logo dimensions, season results
coming from The Blue Alliance. Use them when a request matches, rather than
working from the notes below. Most people asking are not technical: see
GUIDE.md for the vocabulary they will use and expect back.


**A mentor:** add an object to `src/_data/mentors.json` and put a square photo
in `src/assets/img/mentors/<first-last>.jpg` (about 500×500, JPEG quality ~82).

**A sponsor:** drop the logo in `src/assets/img/sponsors/`, then add an entry to
the right tier in `src/_data/sponsors.json`. Tiers render largest first. A
sponsor with `"logo": null` renders as a name in text. Set `"showName": true`
to print the name under a logo.

**A new season:** add an entry to `src/_data/seasons.json` — the page at
`/seasons/<year>/` is generated automatically. Add the year to the "Seasons"
dropdown in `site.json`'s `nav`. Gallery photos go in
`src/assets/img/seasons/<year>/gallery/` numbered `01.jpg`, `02.jpg`, … and the
count goes in the season's `gallery.count`.

**A new page:** create `src/<name>.njk` with front matter setting
`layout: layouts/base.njk`, `permalink`, `title` and `description`, then add it
to `nav` in `site.json`.

**Renaming a page:** add the old path to `src/_data/redirects.json` so existing
links and bookmarks keep working.

## Images

Source images are committed already optimized. When adding new ones, resize
before committing — nothing in the build pipeline resizes images.

| Use                | Max width | Format |
| ------------------ | --------- | ------ |
| Hero / full-bleed  | 1800px    | JPEG q82 |
| Section photo      | 1400px    | JPEG q82 |
| Gallery photo      | 1400px    | JPEG q82 |
| Mentor headshot    | 500px     | JPEG q82 |
| Sponsor logo       | 540–700px | PNG if it needs transparency, else JPEG |

Animated heroes are animated WebP (`hero/*.webp`), converted from the original
GIFs. They are far smaller than GIF and drop into an ordinary `<img>`.

## Publishing

`main` is the live site. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages,
served at www.lynkrobotics.org.

**Always work on a branch and open a pull request. Never push to `main`.**
`main` is protected: pushes to it are restricted to the website-maintainers
team, so a direct push will be rejected. A maintainer reviews the screenshots
and the Cloudflare preview, then merges — that merge is what publishes.

Anyone in the LynkRobotics org can open a pull request; only maintainers can
merge one. CONTRIBUTING.md explains this to contributors, SETUP.md records the
GitHub settings behind it.

`src/CNAME` must keep containing `www.lynkrobotics.org` — the deploy fails
loudly if it goes missing, because losing it would drop the custom domain, and
`check-links.mjs` fails if the value changes.

**Do not switch the canonical host back to the bare apex.** Browsers that
visited the pre-migration Squarespace site cached a permanent
`lynkrobotics.org → www.lynkrobotics.org` redirect. Serving at `www` is what
keeps those browsers out of a redirect loop; README.md explains it in full.

## Known content issues (inherited from the old Google Sites site)

These were carried over verbatim during the migration rather than silently
"fixed". Change them when the team confirms the right values:

1. The FAQ answer "What does an FRC season look like?" had hard-coded 2024
   championship dates; they were made generic during migration.
2. The FAQ answer about attending an off-season event referenced a **2023**
   THOR West date; it now points at the home page events list instead.
3. The home page still describes LYNK as a "third year" team, which was true
   for the 2026 season as written but will need bumping each year.

Two issues logged here originally — the 2025 season page quoting 2024 match
records, and three of its events linking to 2024 Blue Alliance pages — were
fixed by replacing that data with the real 2025 figures from
[The Blue Alliance](https://www.thebluealliance.com/team/9496/2025).

## Where season results come from

`seasons.json` is hand-maintained, but the numbers should match The Blue
Alliance, which is the authoritative record:
`https://www.thebluealliance.com/team/9496/<year>`. That page is
server-rendered, so it can be read directly without an API key. Take the
official/overall record from the "Event Results" line and each event's rank,
record, awards and playoff outcome from its own block. Do not invent a
playoff outcome TBA does not state — leave `playoff` empty instead.
