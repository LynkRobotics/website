/**
 * Walks the built site in _site/ and fails if any internal link, image,
 * stylesheet or script points at something that was not built.
 *
 * Catches the most common way this site can break: a page renamed in one
 * place but still linked from another. External (http) links are not
 * checked — this stays offline and fast so it can run on every PR.
 *
 * Run with: node scripts/check-links.mjs
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SITE = path.resolve("_site");

// Preview builds are served from a sub-path (see eleventy.config.js), so
// links come out as /website/faqs/ rather than /faqs/. Strip the prefix
// before resolving them against _site/.
const PATH_PREFIX = (process.env.PATH_PREFIX || "/").replace(/\/+$/, "");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Resolves a site-root-relative URL to a file that should exist on disk. */
function candidates(url) {
  let clean = url.split("#")[0].split("?")[0];
  if (PATH_PREFIX && clean.startsWith(`${PATH_PREFIX}/`)) {
    clean = clean.slice(PATH_PREFIX.length);
  }
  if (!clean || clean === "/") return [path.join(SITE, "index.html")];
  const base = path.join(SITE, decodeURIComponent(clean));
  return clean.endsWith("/")
    ? [path.join(base, "index.html")]
    : [base, path.join(base, "index.html"), `${base}.html`];
}

const files = (await walk(SITE)).filter((f) => f.endsWith(".html"));
const problems = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  const rel = file.replace(`${SITE}/`, "");
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const url of urls) {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(url)) continue;
    if (!url.startsWith("/")) {
      problems.push(`${rel}: relative URL "${url}" — use a root-relative path`);
      continue;
    }
    checked++;
    if (!candidates(url).some((p) => existsSync(p))) {
      problems.push(`${rel}: broken link -> ${url}`);
    }
  }
}

// A couple of files must exist for the deploy to be correct at all.
for (const required of ["CNAME", "index.html", "404.html", "sitemap.xml"]) {
  if (!existsSync(path.join(SITE, required))) {
    problems.push(`missing required file: _site/${required}`);
  }
}

const cname = path.join(SITE, "CNAME");
if (existsSync(cname)) {
  const domain = (await readFile(cname, "utf8")).trim();
  if (domain !== "www.lynkrobotics.org") {
    problems.push(`CNAME is "${domain}", expected "www.lynkrobotics.org"`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s) found:\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log(
  `✓ ${checked} internal links across ${files.length} pages all resolve.`,
);
