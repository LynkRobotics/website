# lynkrobotics.org

The website for **LYNK Robotics**, FIRST® Robotics Competition Team 9496,
operating under Inspire Carolina, Inc.

Static site built with [Eleventy](https://www.11ty.dev/), published to GitHub
Pages at <https://lynkrobotics.org>.

> **Setting this up for the first time?** Start with [SETUP.md](SETUP.md) —
> the branch, GitHub Pages and DNS steps that have to happen once before
> lynkrobotics.org serves this site.

---

## The everyday workflow

The point of this repository is that changes get **written by Claude**,
**reviewed by a human on their own machine**, and only then **published**.

```
  ask Claude for a change
          │
          ▼
  Claude commits to a branch and opens a pull request
          │
          ▼
  you pull the branch and run `npm start`  ←─ review it in a real browser
          │
          ▼
  merge the pull request into `main`
          │
          ▼
  GitHub Actions builds and deploys  →  lynkrobotics.org  (about 1–2 minutes)
```

Nothing reaches the public site until a human merges to `main`.

### 1. Ask for a change

Point Claude at this repository and describe what you want, e.g.

> Add Jane Doe to the mentors page — Mechanical Mentor, engineer at Acme,
> joined 2026. Her photo is in `~/Downloads/jane.jpg`.

> Update the home page events: we qualified for States, and the Pembroke
> event moved to the Jones Center gym.

Claude will make the change on a branch and open a pull request.
`CLAUDE.md` tells it where everything lives and what the house style is.

### 2. Review it locally

Once, to set up:

```bash
git clone https://github.com/LynkRobotics/website.git
cd website
npm install
```

Then for each review:

```bash
git fetch origin
git checkout <branch-name>     # the PR page shows the branch name
npm start
```

Open <http://localhost:8080>. The preview reloads as files change.
Press `Ctrl-C` to stop.

To check the whole site builds cleanly and no links are broken:

```bash
npm run check
```

### 3. Or review it on the web

If you would rather not run anything locally, push the branch and run the
**Deploy preview** workflow (Actions → *Deploy preview* → Run workflow). It
publishes to <https://lynkrobotics.github.io/website/> without touching
lynkrobotics.org.

Note that the preview and the live site share one GitHub Pages slot: whichever
workflow ran last is what Pages serves. After previewing, re-run **Deploy to
GitHub Pages** to put the live build back.

### 4. Publish

Merge the pull request on GitHub. The **Deploy to GitHub Pages** workflow runs
automatically; watch it under the repository's **Actions** tab. When it goes
green, the change is live at lynkrobotics.org.

To roll back, revert the merge commit on `main` — the next deploy restores the
previous state.

---

## What lives where

Content is **data, not markup**. Most changes are a few lines of JSON.

| File                          | Controls                                        |
| ----------------------------- | ----------------------------------------------- |
| `src/_data/site.json`         | Site name, navigation, contact details, social and donation links |
| `src/_data/mentors.json`      | The Mentors page                                |
| `src/_data/board.json`        | The Inspire Carolina board page                 |
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

## Commands

| Command         | What it does                                              |
| --------------- | --------------------------------------------------------- |
| `npm install`   | Install dependencies (once, and after `package.json` changes) |
| `npm start`     | Local preview on <http://localhost:8080> with live reload  |
| `npm run build` | Build the site into `_site/`                               |
| `npm run check` | Build, then verify every internal link resolves            |
| `npm run clean` | Delete `_site/`                                            |
| `npm run check:preview` | Build and check the sub-path preview build         |

Requires Node.js 20 or newer.

## Hosting

- **Source of truth:** the `main` branch of this repository.
- **Build and deploy:** `.github/workflows/deploy.yml` on every push to `main`.
- **Custom domain:** `src/CNAME` contains `lynkrobotics.org`. The build fails if
  that file goes missing, since losing it would drop the custom domain.
- **Both `lynkrobotics.org` and `www.lynkrobotics.org`** serve the site; GitHub
  redirects `www` to the apex domain.

Old Google Sites paths (`/lynk`, `/lynk/lynk-faqs`, `/our-people/mentors-lynk`,
and so on) redirect to their new homes — see `src/_data/redirects.json`.

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
