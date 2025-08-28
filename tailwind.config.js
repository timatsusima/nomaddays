/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors (Notion-like)
        'nomad-bg': '#ffffff',
        'nomad-surface': '#f7f6f3',
        'nomad-text': '#37352f',
        'nomad-text-secondary': '#787774',
        'nomad-border': '#e9e8e6',
        'nomad-hover': '#f1f1ef',
        'nomad-brand': '#2eaadc',
        'nomad-brand-hover': '#1ea7d4',
        'nomad-red': '#ef5350',
        'nomad-green': '#4caf50',
        // Dark theme colors (Revolut-like)
        'nomad-dark-bg': '#1c1c1e',
        'nomad-dark-surface': '#2c2c2e',
        'nomad-dark-text': '#ffffff',
        'nomad-dark-text-secondary': '#a0a0a0',
        'nomad-dark-border': '#3a3a3c',
        'nomad-dark-hover': '#3a3a3c',
        'nomad-dark-brand': '#0a84ff',
        'nomad-dark-brand-hover': '#30a4ff',
        'nomad-dark-red': '#ff453a',
        'nomad-dark-green': '#30d158',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '9999px',
        'input': '12px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      minHeight: {
        'touch': '44px',
        'touch-small': '40px',
      }
    },
  },
  plugins: [],
}