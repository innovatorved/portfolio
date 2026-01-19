// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://beta.vedgupta.in',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), partytown({
    config: {
      forward: ["dataLayer.push"],
    },
  })],

  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ufs.sh'
      },
      {
        protocol: 'https',
        hostname: '2n8oqvqetc.ufs.sh'
      },
      {
        protocol: 'https',
        hostname: 'j9277ckk5t.ufs.sh'
      },
      {
        protocol: 'https',
        hostname: '**.uploadthing.com'
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ]
  },

  // Production optimizations
  build: {
    inlineStylesheets: 'auto'
  },
});