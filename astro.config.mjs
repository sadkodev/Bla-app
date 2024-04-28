import db from '@astrojs/db'
import node from '@astrojs/node'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db()],
  output: 'server',
  adapter: node({
    mode: 'middleware',
  }),
  vite: {
    optimizeDeps: {
      exclude: ['oslo'],
    },
    ssr: {
      noExternal: ['path-to-regexp'],
    },
  },
})
