# Setup and cutover

How lynkrobotics.org got from the old Google Sites site to this repository, and
what is left to do. Day-to-day publishing is in [README.md](README.md).

**The site is live at <https://www.lynkrobotics.org>.** Outstanding: connecting
Cloudflare for previews, setting up who can propose versus publish, and tidying
the Google Site.

---

## Where things stand

| | |
| --- | --- |
| Repository | `main` is the default branch and the source of truth |
| Pages | Enabled, source **GitHub Actions**, deploying green on every push |
| Custom domain | `www.lynkrobotics.org` — **canonical**, see below |
| Apex | `lynkrobotics.org` 301-redirects to `www` |
| HTTPS | Certificate issued, Enforce HTTPS on |
| DNS | Apex → GitHub `A` records; `www` → `lynkrobotics.github.io` |

## Why `www` is the canonical host

This matters enough that it is also in README.md and CLAUDE.md: **do not
reverse it.**

Before the migration Squarespace served `lynkrobotics.org` and answered with a
`301 Moved Permanently` to `www.lynkrobotics.org`. A 301 tells the browser
"never ask again", so every browser that visited the old domain still has that
redirect cached locally.

The site originally launched with the apex as canonical, which meant GitHub
sent `www` back to the apex. For anyone holding the cached Squarespace
redirect, that was an infinite loop — `ERR_TOO_MANY_REDIRECTS`, reproducible in
a normal window and invisible in incognito. Serving at `www` means the stale
cached redirect lands on a real page.

Switching back would recreate the loop from the other side, since browsers will
now have cached GitHub's own apex → `www` redirect.

If a visitor still reports the loop, they visited during the brief window when
the apex was canonical. One-time fix in their browser: DevTools → Application →
Storage → **Clear site data**.

## DNS, for reference

Nameservers are `ns-cloud-b1.googledomains.com` … `b4`, i.e. the Google Domains
/ Squarespace Domains setup.

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153`, `8001::153`, `8002::153`, `8003::153` — *not yet added* |
| `www` | CNAME | `lynkrobotics.github.io.` |

The apex `A` records are still needed even though `www` is canonical — they are
what lets GitHub answer on the apex in order to redirect it.

`docs.lynkrobotics.org` is unrelated and should be left alone.

**Still worth doing:** the apex has no `AAAA` records, so IPv6-only visitors
cannot reach it. Not urgent — every other visitor is fine, and `www` already
has IPv6 — but add them when convenient.

## Connect Cloudflare for previews

Gives every branch an automatic, clickable preview URL, posted as a comment on
the pull request, so a change can be reviewed without running anything locally.
Production is untouched — GitHub Pages keeps serving www.lynkrobotics.org.

Free tier, no card required.

> **Workers, not Pages.** Cloudflare has absorbed Pages into Workers, and new
> projects go through the Workers flow — the setup screen says "Configure your
> Worker project" and the deploy command is `npx wrangler deploy`. That is the
> right path; do not go looking for the old Pages UI. Workers Builds posts the
> same PR comments with preview URLs.

### Settings

1. <https://dash.cloudflare.com> → **Compute (Workers & Pages)** → **Create** →
   **Import a repository**.
2. Authorise Cloudflare for the **LynkRobotics** org and pick **website**.
   Granting access to just that one repository is fine.
3. Fill in:

   | Field | Value |
   | --- | --- |
   | Project name | `lynk-website` |
   | Build command | `npm run build:preview` |
   | Deploy command | `npx wrangler deploy` *(the default)* |
   | Builds for non-production branches | **ticked** |
   | Non-production branch deploy command | `npx wrangler versions upload` *(the default)* |
   | Path | `/` *(the default)* |
   | API token | **Create new token**, name it `lynk-website-builds` |

   Everything except the build command is Cloudflare's default. The API token
   is created automatically — you only supply a name.

   **The project name must be exactly `lynk-website`,** because it has to match
   `"name"` in `wrangler.jsonc`. A mismatch fails the deploy.

4. **Save and Deploy.**

### What each command does

- **Build command** `npm run build:preview` — builds the site into `_site/`,
  then marks it as a preview (below).
- **Deploy command** `npx wrangler deploy` — runs on `main` only. Publishes to
  `lynk-website.<your-subdomain>.workers.dev`.
- **Non-production deploy** `npx wrangler versions upload` — runs on every
  other branch. Uploads a *version* without making it live, which is what
  generates the shareable preview URL Cloudflare comments on the pull request.
- **Path** `/` — the repository root, where `package.json` and
  `wrangler.jsonc` live.

`wrangler.jsonc` in the repository is what makes this work. It is an
assets-only Worker — no server code, no entry point — that serves whatever is
in `_site/`, with `not_found_handling` set so a bad URL gets our styled 404
page just as it does on the live site.

### Why the build command is `build:preview`, not `build`

`npm run build:preview` runs the normal build and then
`scripts/mark-preview.mjs`, which makes a Cloudflare deployment unmistakably
*not* the live site:

- deletes `CNAME`, so it can never claim www.lynkrobotics.org;
- writes a disallow-all `robots.txt` and adds `noindex` to every page, so
  `*.workers.dev` URLs stay out of Google;
- stamps a small **Preview** badge, naming the branch and commit, on every page.

Cloudflare also builds `main` and publishes it at
`lynk-website.<subdomain>.workers.dev`. That is harmless — it carries the same
badge and noindex, and no DNS points at it. The live site remains GitHub Pages.

### If you would rather not use Cloudflare

Delete the project in the Cloudflare dashboard. Nothing in this repository
breaks; `build:preview` and `wrangler.jsonc` simply stop being used. You would
be back to reviewing from the screenshots in Claude's replies, or locally with
`npm start`.

## Who can propose and who can publish

The goal: **anyone in the LynkRobotics org can open a pull request; only a few
people can merge it and put it live.** Three things set that up. All of them
are GitHub settings — the repository already carries the files they depend on
(`.github/CODEOWNERS`, the pull request template, CONTRIBUTING.md).

### 1. Two teams

At <https://github.com/orgs/LynkRobotics/teams>, create:

| Team | Members | Repo access |
| --- | --- | --- |
| `website-contributors` | everyone who should be able to propose changes | **Write** |
| `website-maintainers` | the few who may publish | **Write** |

Both get **Write** — that is deliberate. Write is what lets someone push a
branch and open a pull request. Merging is restricted separately, in step 2;
that is the only thing that separates the two groups.

Grant access under the repository's **Settings → Collaborators and teams →
Add teams**. Do not give either team Admin.

> The team slug must be exactly `website-maintainers`, because
> `.github/CODEOWNERS` names it. If you prefer a different name, change it in
> both places.
>
> Alternatively, skip `website-contributors` and set the organisation's base
> permission to **Write** (Organization settings → Member privileges). That
> covers every org member automatically, but applies to every repository in
> the org — the team is the tighter option.

### 2. Protect `main`

**Settings → Branches → Add branch protection rule**, branch name pattern
`main`:

- [x] **Require a pull request before merging**
  - [x] Require approvals — **1**
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] **Require review from Code Owners**
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Search for and select **build** (from the *Build check* workflow)
- [x] **Restrict who can push to matching branches**
  - Add the **website-maintainers** team
- [x] **Do not allow bypassing the above settings**

**"Restrict who can push" is the setting that does the real work.** Merging a
pull request is a push to `main`, so restricting pushes also restricts
merging: everyone else keeps a fully working *Open pull request* button and no
*Merge* button at all.

"Require review from Code Owners" then makes the approval meaningful — with
`CODEOWNERS` marking maintainers as the owner of every file, a pull request
cannot go in without one of them signing off.

> Using **Rules → Rulesets** instead of classic branch protection works too.
> Target `main`, enable *Require a pull request before merging*,
> *Require review from Code Owners*, *Require status checks*, and
> *Restrict updates*, then put `website-maintainers` in the bypass list.

### 3. Check it

Ask someone in `website-contributors` but *not* in `website-maintainers` to
open a trivial pull request. They should be able to open it and see the
preview, and the Merge button should be greyed out with "Merging is blocked".

### What this changes for Claude

Claude can no longer push to `main`, which is the point. From here on it
pushes a branch and opens a pull request like everyone else, and a maintainer
merges. `CLAUDE.md` records this.

## Tidy up the Google Site

The other outstanding task. Edit the Google Site at inspirecarolina.org so the two
sites do not compete for the same search results.

**Keep** the Home page and **Board Members - ICI** — the Inspire Carolina board
belongs to the non-profit, and lynkrobotics.org links out to it. Keep **Our
People** too, as that page's parent.

**Delete** these, which now live on lynkrobotics.org:

| Google Sites page | Now at |
| --- | --- |
| Invest | <https://www.lynkrobotics.org/invest/> |
| Our People → Mentors - LYNK | <https://www.lynkrobotics.org/our-people/mentors/> |
| Experiences That Matter | <https://www.lynkrobotics.org/experiences/> |
| LYNK | <https://www.lynkrobotics.org/> |
| LYNK → LYNK Registration | <https://www.lynkrobotics.org/registration/> |
| LYNK → LYNK FAQs | <https://www.lynkrobotics.org/faqs/> |
| LYNK → 2025 Season | <https://www.lynkrobotics.org/seasons/2025/> |
| LYNK → 2024 Season (Rookie) | <https://www.lynkrobotics.org/seasons/2024/> |
| LYNK → Member Login | *not migrated — see README.md* |

Then update what remains:

- Trim the navigation to Home, Our People and Board Members - ICI, plus a single
  outbound **LYNK Robotics** link to <https://www.lynkrobotics.org>.
- **LYNK Robotics Info** button → <https://www.lynkrobotics.org>
- **Investor Information** button → <https://www.lynkrobotics.org/invest/>
- The body text link on "LYNK" → <https://www.lynkrobotics.org>
- On **Our People**, the sentence about mentors → <https://www.lynkrobotics.org/our-people/mentors/>

## Optional, once things settle

- **Search Console.** Add `www.lynkrobotics.org` at
  <https://search.google.com/search-console> and submit
  `https://www.lynkrobotics.org/sitemap.xml`. This is what moves Google's index
  across; without it the Google Sites URLs linger for weeks.
- **Apex AAAA records**, per the DNS table above.

---

## Checklist

- [x] `main` created and set as the default branch
- [x] Pages enabled, source set to **GitHub Actions**
- [x] Squarespace records removed, GitHub `A` records added on the apex
- [x] `www` CNAME → `lynkrobotics.github.io.`
- [x] Registrar domain forwarding turned off
- [x] Custom domain set to `www.lynkrobotics.org`
- [x] Enforce HTTPS ticked
- [ ] Cloudflare connected for automatic previews
- [ ] `website-contributors` and `website-maintainers` teams created, both Write
- [ ] Branch protection on `main`, with push restricted to maintainers
- [ ] Verified: a contributor can open a PR but cannot merge it
- [ ] Apex `AAAA` records added for IPv6
- [ ] Google Site trimmed, links repointed
- [ ] Sitemap submitted to Search Console
- [ ] Branch protection on `main`
