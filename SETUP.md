# Setup and cutover

How lynkrobotics.org got from the old Google Sites site to this repository, and
what is left to do. Day-to-day publishing is in [README.md](README.md).

**The site is live at <https://www.lynkrobotics.org>.** Everything below is
either done or optional; the only outstanding item is tidying the Google Site
(step 5).

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

## 5. Tidy up the Google Site

The one outstanding task. Edit the Google Site at inspirecarolina.org so the two
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

## 6. Optional, once things settle

- **Search Console.** Add `www.lynkrobotics.org` at
  <https://search.google.com/search-console> and submit
  `https://www.lynkrobotics.org/sitemap.xml`. This is what moves Google's index
  across; without it the Google Sites URLs linger for weeks.
- **Branch protection.** Settings → Branches → require a pull request for
  `main`. Makes the review step in README.md a guarantee rather than a habit.
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
- [ ] Apex `AAAA` records added for IPv6
- [ ] Google Site trimmed, links repointed
- [ ] Sitemap submitted to Search Console
- [ ] Branch protection on `main`
