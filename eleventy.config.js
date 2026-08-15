/**
 * Eleventy configuration for lynkrobotics.org
 *
 * Source lives in src/, the built site is written to _site/.
 * Everything under src/assets/ is copied through untouched.
 */
export default function (eleventyConfig) {
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
