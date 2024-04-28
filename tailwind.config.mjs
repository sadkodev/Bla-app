/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B4B8D',
        secondary: '#B58A62',
        tertiary: '#D9A566',
        status: {
          success: '#4CAF50',
          warning: '#FFC107',
          danger: '#F44336',
        },
        shadow: {
          light: 'rgba(0, 0, 0, 0.05)',
          dark: 'rgba(0, 0, 0, 0.1)',
        },
        bg_color: {
          light: '#F9FAFB',
          dark: '#10151D',
        },
        fg_color: {
          light: '#2D3748',
          dark: '#BFC7D2',
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.content-hidden': {
          'content-visibility': 'hidden',
        },
        '.content-visible': {
          'content-visibility': 'visible',
        },
        '.test': {
          border: '1px dotted red',
        },
      })
    }),
  ],
}
