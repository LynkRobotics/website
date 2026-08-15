# One-time setup

Steps to take this repository from "code exists" to "lynkrobotics.org serves
it". Everything here is done once. Day-to-day publishing is covered in
[README.md](README.md).

Steps 1–3 are yours; nothing is live until you finish step 4.

---

## 1. Review the site locally

```bash
git clone https://github.com/LynkRobotics/website.git
cd website
git checkout claude/lynk-robotics-github-setup-c8ww1j
npm install
npm start
```

Open <http://localhost:8080> and click through every page. Compare against the
current site at <https://www.inspirecarolina.org/lynk>.

Things worth looking at specifically:

- The home page is the old `/lynk` page, with the animated logo hero.
- Investor logos, mentor photos and board photos are all carried across.
- `/seasons/2025/` and `/seasons/2024/` replace the old season pages, with the
  photo carousels turned into grids.
- Try it narrow — drag the window down to phone width. The old site was not
  especially good on mobile; this one should be.

## 2. Create the `main` branch

The repository currently has no `main` branch — it was empty before this work,
so the migration branch is the only branch that exists. `main` is what the
deploy workflow watches, so it has to exist before anything can publish.

Once you are happy with the review:

```bash
git checkout claude/lynk-robotics-github-setup-c8ww1j
git branch main
git push -u origin main
```

Then in **Settings → General → Default branch**, confirm the default is `main`.

> Nothing is published yet. GitHub Pages is not switched on until step 3, so
> pushing `main` is safe.

## 3. Turn on GitHub Pages

In the repository, go to **Settings → Pages**:

1. **Build and deployment → Source:** choose **GitHub Actions**.
   (Not "Deploy from a branch" — this repo builds with Eleventy first.)
2. **Custom domain:** enter `lynkrobotics.org` and save.
   GitHub will report the domain as unverified until step 4 — that is expected.
3. Leave **Enforce HTTPS** unchecked for now. Come back and tick it after
   step 4, once GitHub has issued the certificate.

Then open the **Actions** tab and confirm the *Deploy to GitHub Pages*
workflow ran and went green. At this point the site is live at
`https://lynkrobotics.github.io/website/` — the custom domain still needs DNS.

## 4. Point the DNS at GitHub

This is the step that actually moves lynkrobotics.org.

**Where:** the domain's nameservers are
`ns-cloud-b1.googledomains.com` … `ns-cloud-b4.googledomains.com`, i.e. the
Google Domains / Squarespace Domains setup. Edit the zone wherever you manage
it today. (`docs.lynkrobotics.org` is already on GitHub Pages, so this zone has
been pointed at GitHub before.)

### Records to remove

| Host                    | Current value                       | Why |
| ----------------------- | ----------------------------------- | --- |
| `lynkrobotics.org` (apex) | `A 198.185.159.144`               | Squarespace, serves the forward to inspirecarolina.org |
| `www`                   | `CNAME ext-sq.squarespace.com`      | Same |

Also turn off any **domain forwarding / redirect** rule for lynkrobotics.org in
the registrar's control panel. If the forward stays on, it will keep
intercepting requests no matter what the DNS records say.

### Records to add

Apex — four `A` records, all host `@` (or blank, depending on the UI):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Apex — four `AAAA` records, same host (optional but recommended, for IPv6):

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

`www` — one `CNAME`:

```
www   CNAME   lynkrobotics.github.io.
```

Leave `docs.lynkrobotics.org` exactly as it is.

### After DNS propagates

Propagation is usually minutes, occasionally a few hours. Check with:

```bash
dig +short lynkrobotics.org
dig +short www.lynkrobotics.org
```

You want the apex to return the four `185.199.*` addresses and `www` to return
`lynkrobotics.github.io`.

Then go back to **Settings → Pages**, confirm the custom domain shows a green
check, and **tick Enforce HTTPS**. GitHub redirects `www.lynkrobotics.org` to
`lynkrobotics.org` automatically.

## 5. Tidy up the Google Site

Once lynkrobotics.org is serving the new site, edit the Google Site at
inspirecarolina.org so the two do not compete for the same search results.

Keep only the **Home** page. Delete these, which now live on lynkrobotics.org:

| Google Sites page       | Now at                                |
| ----------------------- | ------------------------------------- |
| Invest                  | https://lynkrobotics.org/invest/       |
| Our People              | https://lynkrobotics.org/our-people/   |
| Our People → Board Members - ICI | https://lynkrobotics.org/our-people/board/ |
| Our People → Mentors - LYNK | https://lynkrobotics.org/our-people/mentors/ |
| Experiences That Matter | https://lynkrobotics.org/experiences/  |
| LYNK                    | https://lynkrobotics.org/             |
| LYNK → LYNK Registration | https://lynkrobotics.org/registration/ |
| LYNK → LYNK FAQs        | https://lynkrobotics.org/faqs/         |
| LYNK → 2025 Season      | https://lynkrobotics.org/seasons/2025/ |
| LYNK → 2024 Season (Rookie) | https://lynkrobotics.org/seasons/2024/ |
| LYNK → Member Login     | *not migrated — see README*            |

Then update the remaining Home page:

- Trim the navigation down to Home plus a single outbound "LYNK Robotics" link
  to `https://lynkrobotics.org`.
- The existing **LYNK Robotics Info** button should point to
  `https://lynkrobotics.org`.
- The existing **Investor Information** button should point to
  `https://lynkrobotics.org/invest/`.
- The body text links "LYNK" — point that at `https://lynkrobotics.org` too.

## 6. Optional, once things settle

- **Search Console.** Add `lynkrobotics.org` at
  <https://search.google.com/search-console> and submit
  `https://lynkrobotics.org/sitemap.xml`. This is what tells Google to move
  its index across; without it the Google Sites URLs linger for weeks.
- **Branch protection.** Settings → Branches → add a rule for `main` requiring
  a pull request. Makes the review step in README.md a guarantee rather than a
  habit.

---

## Checklist

- [ ] Reviewed locally with `npm start`
- [ ] `main` branch created and set as default
- [ ] Pages source set to **GitHub Actions**
- [ ] Custom domain set to `lynkrobotics.org`
- [ ] First deploy went green in the Actions tab
- [ ] Squarespace A record and `www` CNAME removed
- [ ] Domain forwarding rule turned off at the registrar
- [ ] GitHub A + AAAA records added on the apex
- [ ] `www` CNAME points to `lynkrobotics.github.io.`
- [ ] Enforce HTTPS ticked
- [ ] Google Site trimmed to Home, links repointed
- [ ] Sitemap submitted to Search Console
