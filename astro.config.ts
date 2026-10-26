import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow.
// Locally the site runs at the root ("/").
const site = process.env.SITE_URL ?? "https://champmillon.fr";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  integrations: [sitemap()],
  markdown: {
    // Keep the text exactly as typed (no automatic curly quotes, dashes or ellipses).
    processor: satteri({ features: { smartPunctuation: false } }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
