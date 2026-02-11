import vercel from "@astrojs/vercel";

import { defineConfig } from "astro/config";
import { remarkAlert } from "remark-github-blockquote-alert";

// https://astro.build/config
export default defineConfig({
  site: "https://www.zama15.net",
  output: "static",
  adapter: vercel(),

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
