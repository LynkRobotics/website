import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

/**
 * Eleventy configuration for lynkrobotics.org
 *
 * Source lives in src/, the built site is written to _site/.
 * Everything under src/assets/ is copied through untouched.
 *
 * PATH_PREFIX lets the same source build for a sub-path. The live site is
 * served at the root of lynkrobotics.org and needs no prefix; the preview
 * deploy (see .github/workflows/preview.yml) is served from
 * lynkrobotics.github.io/website/ and sets PATH_PREFIX=/website/ so that
 * every root-relative link and asset still resolves.
 */
const PATH_PREFIX = process.env.PATH_PREFIX || "/";

export default function (eleventyConfig) {
  // Rewrites href/src in the built HTML to sit under PATH_PREFIX.
  // A no-op when the prefix is "/".
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Static assets pass straight through to the built site.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Rebuild the browser when CSS changes during `npm start`.
  eleventyConfig.addWatchTarget("src/assets/css/");

  /** Absolute URL for sitemaps, canonical tags and social cards. */
  eleventyConfig.addFilter("absoluteUrl", (path, base) =>
    new URL(path, base).href,
  );

  /** "2026-03-05" -> "March 5" */
  eleventyConfig.addFilter("prettyDate", (value) => {
    const d = new Date(`${value}T12:00:00Z`);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  /** Renders a date range the way the team writes it: "March 5 - March 7". */
  eleventyConfig.addFilter("dateRange", (start, end) => {
    const fmt = (v) =>
      new Date(`${v}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    return end && end !== start ? `${fmt(start)} - ${fmt(end)}` : fmt(start);
  });

  /** Groups a flat list into rows of n, used for the sponsor tiers. */
  eleventyConfig.addFilter("chunk", (arr, n) => {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    pathPrefix: PATH_PREFIX,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
