/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        card: 'var(--card-bg)',
        border: 'var(--border-color)',
        mainText: 'var(--text-main)',
        mutedText: 'var(--text-muted)',
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Geist Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'Geist Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
