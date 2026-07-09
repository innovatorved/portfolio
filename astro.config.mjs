// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

export default defineConfig({
  output: "static",
  site: "https://vedgupta.in",
  // Static site — disable advanced routing (src/fetch.ts reserved in Astro 7)
  fetchFile: null,
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        debug: false,
      },
    }),
  ],

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  build: {
    inlineStylesheets: "always",
  },
});
