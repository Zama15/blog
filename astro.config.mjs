import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

import { defineConfig } from "astro/config";
import { remarkAlert } from "remark-github-blockquote-alert";

// https://astro.build/config
export default defineConfig({
  site: "https://www.zama15.net",
  output: "static",
  adapter: vercel(),

  // Lists every prerendered page; the integration already skips 404 and 500,
  // and on-demand routes are not prerendered, so they are never listed.
  integrations: [
    sitemap({
      // List the canonical form: no trailing slash, except the home page.
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname.length > 1) {
          url.pathname = url.pathname.replace(/\/+$/, "");
        }
        return { ...item, url: url.href };
      },
    }),
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["import"],
        },
      },
    },
  },

  markdown: {
    shikiConfig: {
      themes: { light: "catppuccin-latte", dark: "catppuccin-macchiato" },
    },
    remarkPlugins: [remarkAlert],
  },
});
