# One-time setup

Steps to take this repository from "code exists" to "lynkrobotics.org serves
it". Everything here is done once. Day-to-day publishing is covered in
[README.md](README.md).

Nothing reaches lynkrobotics.org until step 4 (DNS). Steps 1–3 are safe to
do at any time — the current site keeps serving throughout.

---

## 1. Make Pages available, then preview on the web

Reviewing does not require running anything locally — see step 3, which
publishes the whole site to a GitHub URL while lynkrobotics.org carries on
serving the current Google Sites page untouched.

If you would rather review locally as well:

```bash
git clone https://github.com/LynkRobotics/website.git
cd website
npm install
npm start
```

Open <http://localhost:8080>.

Either way, things worth looking at specifically:

- The home page is the old `/lynk` page, with the animated logo hero.
- Investor logos, mentor photos and board photos are all carried across.
- `/seasons/2025/` and `/seasons/2024/` replace the old season pages, with the
  photo carousels turned into grids.
- Try it narrow — drag the window down to phone width. The old site was not
  especially good on mobile; this one should be.

## 2. The `main` branch

Done — `main` exists and is the default branch. Every push to it triggers
*Deploy to GitHub Pages*, which is why nothing publishes until Pages is
switched on in step 3.

## 3. Turn on GitHub Pages

**Pages must be available for this repository first.** GitHub only serves
Pages from a *private* repository on the Team plan or above. On the free plan
the Pages settings page will say so, and the deploy fails with
`Get Pages site failed … verify that the repository has Pages enabled`.

Pick one:

- **Make the repository public** (recommended). Everything in it is already
  public information — the site's own content — and this is how almost every
  FRC team's site repository is set up. Settings → General → Danger Zone →
  Change visibility.
- **Or upgrade the organization to GitHub Team**, and keep it private.

Then go to **Settings → Pages**:

1. **Build and deployment → Source:** choose **GitHub Actions**.
   (Not "Deploy from a branch" — this repo builds with Eleventy first.)
2. **Custom domain:** leave it **empty** for now. See step 3b — filling it in
   before DNS moves makes the preview URL unreachable.
3. Open the **Actions** tab, re-run *Deploy to GitHub Pages*, and confirm it
   goes green.

### 3b. Review the real site before touching DNS

With the custom domain empty, run the **Deploy preview** workflow:
Actions → *Deploy preview* → **Run workflow**.

It builds the site for the project Pages sub-path and publishes it to:

**<https://lynkrobotics.github.io/website/>**

That is the whole site, clickable, with working links, images and navigation —
and `lynkrobotics.org` is untouched and still serving the current Google Sites
page the entire time. Review there as long as you like.

The preview also serves a `robots.txt` that disallows crawling, so it will not
compete with the real site in search results.

### 3c. When you are happy

1. **Settings → Pages → Custom domain:** enter `lynkrobotics.org` and save.
2. Do step 4 below (DNS).
3. Actions → *Deploy to GitHub Pages* → **Run workflow**, to replace the
   preview build with the real one. (Any later push to `main` does this too.)
4. Come back and tick **Enforce HTTPS** once GitHub has issued the certificate.

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

- [x] `main` branch created and set as default
- [ ] Repository made public (or org upgraded to Team) so Pages is available
- [ ] Pages source set to **GitHub Actions**, custom domain left empty
- [ ] *Deploy preview* run; site reviewed at lynkrobotics.github.io/website/
- [ ] Custom domain set to `lynkrobotics.org`
- [ ] Squarespace apex `A` record and `www` CNAME removed
- [ ] Domain forwarding rule turned off at the registrar
- [ ] GitHub `A` + `AAAA` records added on the apex
- [ ] `www` CNAME points to `lynkrobotics.github.io.`
- [ ] *Deploy to GitHub Pages* re-run to replace the preview build
- [ ] Enforce HTTPS ticked
- [ ] Google Site trimmed to Home, links repointed
- [ ] Sitemap submitted to Search Console
