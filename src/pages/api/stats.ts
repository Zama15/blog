import type { APIRoute } from "astro";
import { getStatsData } from "../../lib/stats/data";
import { generateSVG } from "../../lib/stats/svg";
import { generateSVG as generateErrorSVG } from "../../lib/stats/errorSvg";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const stats = await getStatsData();
    const svg = generateSVG(stats);

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("API Error generating stats:", error);

    const errorSvg = generateErrorSVG();

    return new Response(errorSvg, {
      status: 500,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      },
    });
  }
};
