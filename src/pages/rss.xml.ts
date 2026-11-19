import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { getAllPosts } from "../lib/data";
import { ROUTES, SITE_DESCRIPTION, SITE_TITLE } from "../lib/constants";

// Built once at build time: a failure fails the build instead of publishing a broken feed.
export const GET: APIRoute = async ({ site }) => {
  const posts = await getAllPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: site!,
    // Item links use the canonical form, without a trailing slash.
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `${ROUTES.BLOG}/${post.data.slug}`,
      pubDate: post.data.date,
      categories: post.data.tags,
    })),
    customData: "<language>en</language>",
  });
};
