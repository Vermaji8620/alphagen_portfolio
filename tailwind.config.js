/** @type {import('tailwindcss').Config} */
function withOpacity(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${varName}), ${opacityValue})`;
    }
    return `rgb(var(${varName}))`;
  };
}

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        institutional: {
          canvas: withOpacity('--color-bg-canvas'),
          panel: withOpacity('--color-bg-panel'),
          card: withOpacity('--color-bg-card'),
          cardHover: withOpacity('--color-bg-card-hover'),
          border: withOpacity('--color-border'),
          borderSubtle: withOpacity('--color-border-subtle'),
          primary: withOpacity('--color-primary'),
          primaryHover: withOpacity('--color-primary-hover'),
          emerald: '#10b981',
          emeraldBg: withOpacity('--color-emerald-bg'),
          emeraldBorder: withOpacity('--color-emerald-border'),
          rose: '#f43f5e',
          roseBg: withOpacity('--color-rose-bg'),
          roseBorder: withOpacity('--color-rose-border'),
          amber: '#f59e0b',
          amberBg: withOpacity('--color-amber-bg'),
          amberBorder: withOpacity('--color-amber-border')
        },
        slate: {
          950: withOpacity('--color-slate-950'),
          900: withOpacity('--color-slate-900'),
          850: withOpacity('--color-slate-850'),
          800: withOpacity('--color-slate-800'),
          750: withOpacity('--color-slate-750'),
          700: withOpacity('--color-slate-700'),
          600: withOpacity('--color-slate-600'),
          500: withOpacity('--color-slate-500'),
          400: withOpacity('--color-slate-400'),
          300: withOpacity('--color-slate-300'),
          200: withOpacity('--color-slate-200'),
          100: withOpacity('--color-slate-100')
        },
        blue: {
          950: withOpacity('--color-blue-950'),
          900: withOpacity('--color-blue-900'),
          800: withOpacity('--color-blue-800'),
          700: withOpacity('--color-blue-700'),
          600: withOpacity('--color-blue-600'),
          500: withOpacity('--color-blue-500'),
          400: withOpacity('--color-blue-400'),
          300: withOpacity('--color-blue-300'),
          200: withOpacity('--color-blue-200'),
          100: withOpacity('--color-blue-100'),
          50: withOpacity('--color-blue-50')
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
