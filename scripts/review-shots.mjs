/**
 * Builds the site, screenshots every page at desktop and phone width, and
 * writes a single self-contained review page.
 *
 * This is how Claude hands a change back for review without the reviewer
 * having to run anything — see the "Handing work back" section of CLAUDE.md.
 * The output is one HTML file with every screenshot inlined, ready to publish
 * as an artifact.
 *
 *   node scripts/review-shots.mjs [outfile] [--pages=/faqs/,/invest/]
 *
 * Defaults to every page in the sitemap and writes to review.html (which is
 * gitignored). Pass --pages to capture only what a change actually touched;
 * that keeps the file small and the review focused.
 *
 * Needs Playwright and a Chromium build. Both are present in Claude Code
 * environments; elsewhere, `npm i -g playwright && npx playwright install
 * chromium`.
 */
import { spawn, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);

/** Playwright may be installed locally or globally; try both. */
function loadPlaywright() {
  try {
    return require("playwright");
  } catch {}
  try {
    const globalRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
    return createRequire(path.join(globalRoot, "noop.js"))("playwright");
  } catch {}
  console.error(
    "Playwright not found. Install it with:\n  npm i -g playwright && npx playwright install chromium",
  );
  process.exit(1);
}

/** Prefer a preinstalled Chromium over one Playwright would download. */
function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(root)) return undefined;
  const dir = readdirSync(root).find((d) => d.startsWith("chromium-"));
  if (!dir) return undefined;
  const bin = path.join(root, dir, "chrome-linux", "chrome");
  return existsSync(bin) ? bin : undefined;
}

const args = process.argv.slice(2);
const outFile = path.resolve(
  args.find((a) => !a.startsWith("--")) || "review.html",
);
const onlyArg = args.find((a) => a.startsWith("--pages="));
const only = onlyArg
  ? onlyArg
      .slice("--pages=".length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : null;

const SITE = path.resolve("_site");
const PORT = 8099 + Math.floor(process.uptime() % 100);

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: "inherit", shell: false });
    p.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

/** Every built page, in a sensible reading order, from the filesystem. */
async function discoverPages() {
  const out = [];
  async function walk(dir, url = "/") {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), `${url}${entry.name}/`);
      } else if (entry.name === "index.html") {
        const html = await readFile(path.join(dir, entry.name), "utf8");
        // Redirect stubs are not worth screenshotting.
        if (!html.includes("Redirecting…")) out.push(url);
      }
    }
  }
  await walk(SITE);
  const order = [
    "/",
    "/invest/",
    "/our-people/",
    "/our-people/mentors/",
    "/experiences/",
    "/registration/",
    "/faqs/",
    "/seasons/2025/",
    "/seasons/2024/",
  ];
  return out.sort((a, b) => {
    const ia = order.indexOf(a),
      ib = order.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
}

const titleFor = (url) =>
  url === "/"
    ? "Home"
    : url
        .split("/")
        .filter(Boolean)
        .pop()
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

console.log("Building…");
await run("npx", ["@11ty/eleventy"]);

const pages = only ?? (await discoverPages());
if (!pages.length) {
  console.error("No pages to capture.");
  process.exit(1);
}

const server = spawn(
  "python3",
  ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"],
  { cwd: SITE, stdio: "ignore", detached: true },
);
const stop = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};
process.on("exit", stop);

await new Promise((r) => setTimeout(r, 1500));

const { chromium } = loadPlaywright();
const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ["--no-sandbox"],
});

const shots = {};
const problems = [];

for (const [name, width, height, mobile] of [
  ["desktop", 1440, 1000, false],
  ["mobile", 390, 844, true],
]) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`JS error: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
  });

  for (const url of pages) {
    await page.goto(`http://127.0.0.1:${PORT}${url}`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    // Force lazy images in so nothing is blank in the capture.
    await page.evaluate(async () => {
      document
        .querySelectorAll('img[loading="lazy"]')
        .forEach((i) => (i.loading = "eager"));
      await Promise.all(
        [...document.images].map((i) =>
          i.complete
            ? Promise.resolve()
            : new Promise((r) => {
                i.onload = i.onerror = r;
              }),
        ),
      );
    });
    await page.waitForTimeout(600);
    const buf = await page.screenshot({ fullPage: true, type: "jpeg", quality: 60 });
    (shots[url] ||= {})[name] = buf.toString("base64");
    process.stdout.write(`  ${name} ${url}\n`);
  }
  await ctx.close();
}

await browser.close();
stop();

const panels = pages
  .map((url, i) => {
    const imgs = ["desktop", "mobile"]
      .map(
        (vp) =>
          `<figure class="shot" data-vp="${vp}"${vp === "mobile" ? " hidden" : ""}>` +
          `<div class="chrome"><span class="dots"><i></i><i></i><i></i></span>` +
          `<span class="url">www.lynkrobotics.org${url}</span></div>` +
          `<img src="data:image/jpeg;base64,${shots[url][vp]}" alt="${titleFor(url)}, ${vp}" loading="lazy" />` +
          `</figure>`,
      )
      .join("");
    return `<section class="panel" id="p${i}"${i ? " hidden" : ""}>${imgs}</section>`;
  })
  .join("");

const tabs = pages
  .map(
    (url, i) =>
      `<button class="tab" data-i="${i}"${i === 0 ? ' aria-current="true"' : ""}>${titleFor(url)}</button>`,
  )
  .join("");

const uniqueProblems = [...new Set(problems)];

const html = `<title>LYNK Site Proof</title>
<style>
:root{--ground:#fbfaf8;--surface:#fff;--sunk:#f3efea;--ink:#1f1c19;--muted:#6e655d;--accent:#bf5700;--rule:#e6ded4}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ground:#15120f;--surface:#1e1a16;--sunk:#262119;--ink:#f3eee7;--muted:#a3978a;--accent:#e8813a;--rule:#342c24}}
:root[data-theme="dark"]{--ground:#15120f;--surface:#1e1a16;--sunk:#262119;--ink:#f3eee7;--muted:#a3978a;--accent:#e8813a;--rule:#342c24}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);font:15px/1.55 ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px 64px}
.masthead{padding:36px 0 20px;border-bottom:1px solid var(--rule)}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 8px}
h1{font-size:clamp(26px,4vw,36px);line-height:1.1;margin:0 0 8px;letter-spacing:-.015em;text-wrap:balance}
.standfirst{margin:0;max-width:62ch;color:var(--muted)}
.bar{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--ground) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--rule);margin-bottom:26px}
.bar__inner{max-width:1120px;margin:0 auto;padding:10px 20px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.tabs{display:flex;gap:4px;flex-wrap:wrap;flex:1}
.tab{font:inherit;font-size:13px;border:1px solid transparent;background:none;color:var(--muted);padding:6px 11px;border-radius:999px;cursor:pointer;white-space:nowrap}
.tab:hover{color:var(--ink);background:var(--sunk)}
.tab[aria-current="true"]{color:var(--surface);background:var(--accent);border-color:var(--accent);font-weight:600}
.vp{display:flex;gap:2px;background:var(--sunk);padding:3px;border-radius:999px}
.vp button{font:inherit;font-size:12px;border:0;background:none;color:var(--muted);padding:5px 13px;border-radius:999px;cursor:pointer}
.vp button[aria-pressed="true"]{background:var(--surface);color:var(--ink);font-weight:600}
.shot{margin:0 0 26px}.shot[hidden]{display:none}
.chrome{display:flex;align-items:center;gap:12px;background:var(--sunk);border:1px solid var(--rule);border-bottom:0;border-radius:10px 10px 0 0;padding:9px 13px}
.dots{display:flex;gap:6px}.dots i{width:10px;height:10px;border-radius:50%;background:var(--rule)}
.url{font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--muted)}
.shot img{display:block;width:100%;height:auto;border:1px solid var(--rule);border-radius:0 0 10px 10px;background:var(--surface)}
.shot[data-vp="mobile"]{max-width:400px}
.note{margin-top:32px;padding:14px 16px;border-radius:10px;border:1px solid var(--rule);background:var(--surface);font-size:13.5px;color:var(--muted)}
.note--bad{border-left:3px solid var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}
</style>
<div class="wrap"><div class="masthead">
<p class="eyebrow">${pages.length} page${pages.length === 1 ? "" : "s"} · desktop &amp; phone</p>
<h1>Change proof</h1>
<p class="standfirst">Screenshots of the built site. Nothing here is live — the change reaches www.lynkrobotics.org only when the pull request is merged.</p>
</div></div>
<div class="bar"><div class="bar__inner">
<div class="tabs">${tabs}</div>
<div class="vp" role="group" aria-label="Viewport">
<button data-vp="desktop" aria-pressed="true">Desktop</button>
<button data-vp="mobile" aria-pressed="false">Phone</button>
</div></div></div>
<div class="wrap">${panels}
<p class="note${uniqueProblems.length ? " note--bad" : ""}">${
  uniqueProblems.length
    ? `<strong>${uniqueProblems.length} issue(s) during capture:</strong><br>` +
      uniqueProblems.slice(0, 12).map((p) => p.replace(/</g, "&lt;")).join("<br>")
    : "No console errors, and every asset loaded, on every page captured."
}</p></div>
<script>
const panels=[...document.querySelectorAll('.panel')],tabs=[...document.querySelectorAll('.tab')];
tabs.forEach(t=>t.addEventListener('click',()=>{
  tabs.forEach(x=>x.removeAttribute('aria-current'));t.setAttribute('aria-current','true');
  panels.forEach((p,i)=>p.hidden=String(i)!==t.dataset.i);window.scrollTo({top:0});
}));
document.querySelectorAll('.vp button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.vp button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  document.querySelectorAll('.shot').forEach(s=>s.hidden=s.dataset.vp!==b.dataset.vp);
}));
</script>`;

await writeFile(outFile, html);
const mb = (statSync(outFile).size / 1e6).toFixed(1);
console.log(`\nWrote ${outFile} (${mb} MB, ${pages.length} pages)`);
if (uniqueProblems.length) {
  console.log(`\n${uniqueProblems.length} problem(s) during capture:`);
  for (const p of uniqueProblems.slice(0, 12)) console.log(`  ${p}`);
}
