/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0b0f19',
          900: '#0f172a',
          850: '#131d35',
          800: '#1e293b',
          750: '#26334a',
          700: '#334155',
        },
        fintech: {
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
