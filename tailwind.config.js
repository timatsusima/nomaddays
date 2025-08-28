/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': 'var(--brand)',
        'brand-hover': 'var(--brand-hover)',
        'bg': 'var(--bg)',
        'surface': 'var(--surface)',
        'text': 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'border': 'var(--border)',
        'hover': 'var(--hover)',
        'red': 'var(--red)',
        'green': 'var(--green)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
    },
  },
  plugins: [],
}