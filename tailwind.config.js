/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Modern Security & Trust theme: navy + white + green accent
        security: {
          50: '#f0f4fa',
          100: '#e2e8f2',
          200: '#c5d1e4',
          300: '#9bb0cf',
          400: '#6b8ab8',
          500: '#4a6fa0',
          600: '#3a5a87',
          700: '#2d486b',
          800: '#1e3554',
          900: '#152540',
          950: '#0d1828',
        },
        // CTA accent: one green used site-wide for buttons
        accent: {
          DEFAULT: '#059669',
          hover: '#047857',
          light: '#d1fae5',
        },
        // Theme 3: Smart Security Tech — deep black / graphite + neon lime
        cyber: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        neon: {
          DEFAULT: '#84cc16',
          hover: '#65a30d',
          light: '#ecfccb',
        },
        // Temp4 SecureGuard theme
        sgPrimary: '#136dec',
        sgBgLight: '#f6f7f8',
        sgBgDark: '#101822',
        sgNavy: '#0f172a',
        sgCharcoal: '#334155',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
