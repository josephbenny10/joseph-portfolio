/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          bg: '#0F1432',
          surface: '#13193D',
          surfaceDark: '#0A0E26',
          amber: '#FFAA00',
          red: '#FF001E',
          text: '#F2F0E9',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Barlow Condensed"', '"Plus Jakarta Sans"', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        wosker: ['"Wosker Demo"', '"Barlow Condensed"', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        wide: '0.04em',
        widest: '0.12em',
      },
    },
  },
  plugins: [],
}
