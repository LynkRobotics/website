/**
 * Turns a normal build in _site/ into a clearly-marked preview build.
 *
 * Cloudflare Pages runs this after `eleventy` (see the `build:preview` script)
 * so that a preview deployment can never be mistaken for, or compete with, the
 * live site at www.lynkrobotics.org:
 *
 *   1. Deletes CNAME  — a preview must never claim the custom domain.
 *   2. Writes a disallow-all robots.txt, and adds a noindex meta tag to every
 *      page, so *.pages.dev URLs stay out of search results.
 *   3. Stamps a small "Preview" badge onto every page, naming the branch, so
 *      nobody shares a preview link thinking it is the real site.
 *
 * Run with: node scripts/mark-preview.mjs
 */
import { readdir, readFile, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SITE = path.resolve("_site");

// Cloudflare Pages sets these; they are empty when run locally.
const BRANCH = process.env.CF_PAGES_BRANCH || process.env.BRANCH || "";
const COMMIT = (process.env.CF_PAGES_COMMIT_SHA || "").slice(0, 7);
const LABEL = [BRANCH, COMMIT].filter(Boolean).join(" · ") || "local build";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const BADGE = `
<style>
  .preview-badge {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    background: #1c1c1c;
    color: #fff;
    font: 600 0.75rem/1 "Red Hat Display", system-ui, sans-serif;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    pointer-events: none;
  }
  .preview-badge::before {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #bf5700;
  }
  .preview-badge span { opacity: 0.62; font-weight: 400; }
  @media print { .preview-badge { display: none; } }
</style>
<div class="preview-badge" role="status">Preview <span>${LABEL}</span></div>
`.trim();

if (!existsSync(SITE)) {
  console.error("_site/ not found — run `npm run build` first.");
  process.exit(1);
}

// 1. A preview must not claim the custom domain.
await rm(path.join(SITE, "CNAME"), { force: true });

// 2. Keep previews out of search results.
await writeFile(
  path.join(SITE, "robots.txt"),
  "# Preview deployment — not the live site.\nUser-agent: *\nDisallow: /\n",
);
await rm(path.join(SITE, "sitemap.xml"), { force: true });

// 3. noindex + badge on every page.
const pages = (await walk(SITE)).filter((f) => f.endsWith(".html"));
let stamped = 0;

for (const file of pages) {
  let html = await readFile(file, "utf8");
  if (html.includes("preview-badge")) continue;

  // Redirect stubs already carry a noindex; do not add a second one.
  if (html.includes("</head>") && !html.includes('name="robots"')) {
    html = html.replace(
      "</head>",
      '<meta name="robots" content="noindex, nofollow" /></head>',
    );
  }
  // Redirect stubs have no visible body worth stamping.
  if (html.includes("</body>") && !html.includes("Redirecting…")) {
    html = html.replace("</body>", `${BADGE}</body>`);
    stamped++;
  }
  await writeFile(file, html);
}

console.log(
  `Preview build marked: ${pages.length} pages noindexed, ${stamped} badged (${LABEL}). CNAME and sitemap removed.`,
);
