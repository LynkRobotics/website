# Proposing a change to lynkrobotics.org

**Anyone in the LynkRobotics GitHub organization can propose a change. A small
group of maintainers approves and publishes it.** Nothing you do can put
something on the live site by accident.

> **Not technical?** Read **[GUIDE.md](GUIDE.md)** instead. It covers the same
> ground without assuming you know what Git is, and starts from having no
> accounts at all. This page is the shorter, more technical version.

```
  anyone in the org                     website maintainers
  ─────────────────                     ───────────────────
  open a pull request  ─────────────▶   review the preview
                                        approve
                                        merge  ──▶  www.lynkrobotics.org
```

---

## The easy way: ask Claude

You do not need to know Git, Eleventy, or HTML.

1. Open the repository in [Claude Code](https://claude.ai/code).
2. Describe the change in plain language, or use one of the shortcuts the
   repository provides — `/add-mentor`, `/add-sponsor`, `/update-events`,
   `/new-season` — which prompt you for exactly what each task needs:

   > Add Jane Doe to the mentors page — Mechanical Mentor, engineer at Acme,
   > joined 2026. Her photo is attached.

   > The Pembroke competition moved to March 28–29. Update the home page.

3. Claude edits the right files, checks the build, and opens a pull request.
   Its reply includes a page of screenshots so you can see the result
   immediately.

`CLAUDE.md` in this repository tells Claude where every piece of content lives
and what the house style is, so you do not have to.

## The manual way

If you would rather edit directly:

```bash
git clone https://github.com/LynkRobotics/website.git
cd website
npm install

git checkout -b my-change
# ...edit files...
npm run check          # build + verify no internal link is broken
git commit -am "Describe the change"
git push -u origin my-change
```

Then open a pull request on GitHub.

Most content lives in `src/_data/*.json` — see the table in
[README.md](README.md#what-lives-where). Adding a mentor or a sponsor is a
few lines of JSON, not HTML.

## What happens to your pull request

1. **Build check** runs automatically. It fails if the site does not build or
   if any internal link is broken.
2. **Cloudflare Pages** comments a preview link — the real site, clickable,
   with a *Preview* badge so it cannot be confused with the live one.
3. A **maintainer reviews and approves**. They may push tweaks to your branch
   or ask for changes.
4. When they merge, GitHub Actions deploys to www.lynkrobotics.org in a couple
   of minutes.

You will not see a Merge button, and that is expected — merging is restricted
to maintainers.

## Not using Claude at all

Open a request and a maintainer will handle it:
<https://github.com/LynkRobotics/website/issues/new/choose>

## Becoming a maintainer

Maintainers are members of the
[website-maintainers](https://github.com/orgs/LynkRobotics/teams/website-maintainers)
team. Ask one of them, or email <info@lynkrobotics.org>.

## Things worth knowing

- **Photos** should be sized before committing — nothing in the build resizes
  them. Sizes are in [CLAUDE.md](CLAUDE.md#images); Claude handles this for you.
- **Renaming a page** needs a redirect added to `src/_data/redirects.json`, or
  existing links and bookmarks break.
- **Never commit straight to `main`.** Branch protection prevents it, but the
  habit matters — `main` is the live site.
- **To undo something already live**, revert the merge commit on `main`. The
  next deploy restores the previous state.
