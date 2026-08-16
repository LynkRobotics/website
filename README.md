# lynkrobotics.org

The website for **LYNK Robotics**, FIRST® Robotics Competition Team 9496,
operating under Inspire Carolina, Inc.

Static site built with [Eleventy](https://www.11ty.dev/), published to GitHub
Pages at <https://www.lynkrobotics.org>.

> **Want to change something on the site?** Start with
> **[GUIDE.md](GUIDE.md)** — a walkthrough from nothing to a published change.
> No technical knowledge needed.
>
> **Working on the code?** [CONTRIBUTING.md](CONTRIBUTING.md).
> **Hosting and permissions?** [SETUP.md](SETUP.md).

---

## The everyday workflow

Ask for a change; review it; merge it. **Nothing to install, nothing to run.**

```
  ask Claude for a change
          │
          ▼
  Claude pushes a branch and opens a pull request
          │
          ├──▶ Claude's reply links a page of screenshots,
          │    every affected page at desktop and phone width
          │
          └──▶ Cloudflare comments a live preview URL on the PR,
               the real site, clickable, ~1 minute later
          │
          ▼
  merge the pull request into `main`
          │
          ▼
  GitHub Actions deploys  →  www.lynkrobotics.org  (1–2 min)
```

Nothing reaches the public site until a maintainer merges to `main`.

**Anyone in the LynkRobotics org can propose a change; only the website
maintainers can publish one.** See [CONTRIBUTING.md](CONTRIBUTING.md) if you
are proposing, and [SETUP.md](SETUP.md#who-can-propose-and-who-can-publish) for
the GitHub settings that enforce it.

### 1. Ask for a change

Point Claude at this repository and describe what you want, e.g.

> Add Jane Doe to the mentors page — Mechanical Mentor, engineer at Acme,
> joined 2026. Her photo is in `~/Downloads/jane.jpg`.

> Update the home page events: we qualified for States, and the Pembroke
> event moved to the Jones Center gym.

`CLAUDE.md` tells Claude where everything lives, what the house style is, and
that it owes you a review page with every change.

### 2. Review

Two ways, both handed to you:

- **Screenshots**, linked in Claude's reply. Fastest look — every page the
  change touched, desktop and phone, no waiting.
- **A real preview site**, linked from a comment on the pull request.
  Cloudflare builds every branch automatically. Click through it, test the
  navigation, try it on your phone. Preview builds carry a small **Preview**
  badge and are blocked from search engines, so they can never be mistaken for
  the live site.

### 3. Publish

A maintainer merges the pull request. The **Deploy to GitHub Pages** workflow
runs automatically; when it goes green the change is live at
www.lynkrobotics.org.

If you do not see a Merge button, that is expected — merging is restricted to
the `website-maintainers` team.

To roll back, revert the merge commit on `main` — the next deploy restores the
previous state.

---

## What lives where

Content is **data, not markup**. Most changes are a few lines of JSON.

| File                          | Controls                                        |
| ----------------------------- | ----------------------------------------------- |
| `src/_data/site.json`         | Site name, navigation, contact details, social and donation links |
| `src/_data/mentors.json`      | The Mentors page                                |
| `src/_data/leads.json`        | The two co-lead mentor contact cards            |
| `src/_data/sponsors.json`     | The investor wall and its tiers                 |
| `src/_data/events.json`       | Upcoming events on the home page                |
| `src/_data/faqs.json`         | The FAQs page                                   |
| `src/_data/experiences.json`  | Testimonials on Experiences That Matter         |
| `src/_data/seasons.json`      | Each season page under `/seasons/`              |
| `src/_data/redirects.json`    | Old URLs that must keep working                 |
| `src/assets/css/site.css`     | All styling; design tokens are at the top       |
| `src/assets/img/`             | All imagery                                     |

Page templates are the `.njk` files in `src/`. The shared header and footer are
in `src/_includes/`.

## Running it locally

**Only for people editing the code themselves.** The workflow above never needs
it — see [GUIDE.md](GUIDE.md) for the browser-only path.

```bash
git clone https://github.com/LynkRobotics/website.git
cd website
npm install
npm start          # http://localhost:8080, live reload
```

### Commands

| Command         | What it does                                              |
| --------------- | --------------------------------------------------------- |
| `npm install`   | Install dependencies (once, and after `package.json` changes) |
| `npm start`     | Local preview on <http://localhost:8080> with live reload  |
| `npm run build` | Build the site into `_site/`                               |
| `npm run check` | Build, then verify every internal link resolves            |
| `npm run clean` | Delete `_site/`                                            |
| `npm run review` | Build, screenshot every page, write `review.html`         |
| `npm run build:preview` | Build, then mark it as a preview (what Cloudflare runs) |

Requires Node.js 20 or newer.

## Hosting

- **Source of truth:** the `main` branch of this repository.
- **Production:** `.github/workflows/deploy.yml` builds and deploys to GitHub
  Pages on every push to `main`.
- **Previews:** Cloudflare Workers builds every other branch with
  `npm run build:preview` and comments the preview URL on the pull request.
  Configured by `wrangler.jsonc` (an assets-only Worker). It never serves the
  custom domain — `mark-preview.mjs` strips `CNAME`, blocks indexing and stamps
  a Preview badge on every page.
- **Custom domain:** `src/CNAME` contains `www.lynkrobotics.org`, and that file
  is what actually sets the custom domain on each deploy — it overrides the
  Settings → Pages box. The build fails if it goes missing or disagrees.
- **`www` is canonical.** `lynkrobotics.org` 301-redirects to
  `www.lynkrobotics.org`. This direction is deliberate and should not be
  reversed — see "Why www" below.

Old Google Sites paths (`/lynk`, `/lynk/lynk-faqs`, `/our-people/mentors-lynk`,
and so on) redirect to their new homes — see `src/_data/redirects.json`.

### Why www

Before the migration, Squarespace served `lynkrobotics.org` and answered with a
**permanent** redirect to `www.lynkrobotics.org`. Browsers cache a 301 and stop
asking the server, so every browser that visited the old domain still has that
redirect saved.

If GitHub sent `www` back to the apex — the arrangement this site launched with
— those browsers would bounce between the two forever and show
`ERR_TOO_MANY_REDIRECTS`. Serving the site at `www` means the stale redirect
lands on a real page instead.

Reversing this later would recreate the same loop, this time from GitHub's own
cached apex → www redirect. Leave `www` canonical.

## Design

Carried over from the previous Google Sites theme so the site looks familiar:

- **Burnt orange** `#BF5700` — headings, buttons, the footer
- **Near-black** `#1C1C1C` — body text and the header bar
- **Red Hat Display** for everything, **Roboto** for footer fine print

Fonts are self-hosted, YouTube videos are click-to-load, and the social icons
are inline SVG — so a visitor's browser makes no third-party requests just to
read a page.

---

FIRST® is a registered trademark of For Inspiration and Recognition of Science
and Technology (FIRST), which is not affiliated with this website.
