import { defineMiddleware } from "astro:middleware";

/**
 * Templates and Markdown use simple links such as "/mairie/".
 * When the site is published in a sub-folder (e.g. user.github.io/champmillon/),
 * this rewrites them at build time so they still work. Does nothing at the root.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rootLink = new RegExp(`(href|src)="/(?!/|${escaped.slice(1)}/)`, "g");

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!base || !response.headers.get("content-type")?.includes("text/html")) return response;
  const html = (await response.text()).replace(rootLink, `$1="${base}/`);
  return new Response(html, { status: response.status, headers: response.headers });
});
