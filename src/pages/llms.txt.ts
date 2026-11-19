import type { APIRoute } from "astro";

import { getAllPosts, getAllTags } from "../lib/data";
import {
  ROUTES,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../lib/constants";

// Keeps a value on one line and stops it from breaking the Markdown link syntax.
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();
const linkText = (text: string) => oneLine(text).replace(/([[\]])/g, "\\$1");

// Plain-text index of the site for AI tools (https://llmstxt.org), built at build time.
export const GET: APIRoute = async ({ site }) => {
  const posts = await getAllPosts();
  const tags = (await getAllTags()).sort((a, b) => a.localeCompare(b));
  const url = (path: string) => new URL(path, site).href;

  const postLines = posts.map(
    (post) =>
      `- [${linkText(post.data.title)}](${url(`${ROUTES.BLOG}/${post.data.slug}`)}): ${oneLine(post.data.description)}`,
  );

  const body = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Personal site and technical blog of ${SITE_AUTHOR}, a software developer. Posts are practical notes and step-by-step guides from day-to-day software work.`,
    "",
    ...(tags.length > 0 ? [`Topics: ${tags.join(", ")}`, ""] : []),
    "## Posts",
    "",
    ...postLines,
    "",
    "## Site",
    "",
    `- [About ${SITE_AUTHOR}](${url(ROUTES.ABOUT)}): background, experience and contact`,
    `- [All posts](${url(ROUTES.BLOG)}): every post, newest first`,
    `- [Tags](${url(ROUTES.TAGS)}): posts grouped by topic`,
    `- [RSS feed](${url(ROUTES.RSS)}): new posts as they are published`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
