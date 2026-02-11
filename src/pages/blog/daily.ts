import type { APIRoute } from "astro";
import { getRandomPost } from "../../lib/data";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const randomPost = await getRandomPost();

    if (!randomPost)
      return new Response(null, {
        status: 302,
        headers: { Location: "/blog" },
      });

    return new Response(null, {
      status: 307,
      headers: {
        Location: `/blog/${randomPost.data.slug}`,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("[ERROR]: In daily pick:", error);

    return new Response(null, {
      status: 302,
      headers: { Location: "/blog" },
    });
  }
};
