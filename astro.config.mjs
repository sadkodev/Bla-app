import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'

import db from '@astrojs/db'

// https://astro.build/config
export default defineConfig({
    integrations: [react(), tailwind(), db()],
    output: 'server',
    adapter: vercel(),
    vite: {
        optimizeDeps: {
            exclude: ['oslo'],
        },
    },
})
