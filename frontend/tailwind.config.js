/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wildfire: {
          dark: '#030712',
          navy: '#050b18',
          card: '#0a1224',
          cardAlt: '#0f1b33',
          border: 'rgba(56, 189, 248, 0.15)',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          blue: {
            DEFAULT: '#00e5ff',
            neon: '#38bdf8',
            glow: 'rgba(0, 229, 255, 0.35)',
            deep: '#0369a1',
          },
          cyan: {
            DEFAULT: '#06b6d4',
            light: '#67e8f9',
          },
          violet: {
            DEFAULT: '#8b5cf6',
            light: '#c084fc',
            glow: 'rgba(139, 92, 246, 0.35)',
          },
          risk: {
            high: '#ef4444',
            highBg: 'rgba(239, 68, 68, 0.15)',
            moderate: '#f59e0b',
            moderateBg: 'rgba(245, 158, 11, 0.15)',
            low: '#10b981',
            lowBg: 'rgba(16, 185, 129, 0.15)',
          }
        }
      },
      boxShadow: {
        'neon-blue': '0 0 20px -3px rgba(0, 229, 255, 0.35), 0 0 8px -2px rgba(56, 189, 248, 0.4)',
        'neon-violet': '0 0 20px -3px rgba(139, 92, 246, 0.35), 0 0 8px -2px rgba(192, 132, 252, 0.4)',
        'neon-risk': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit-slow': 'spin 30s linear infinite',
        'orbit-reverse': 'spin 45s linear infinite reverse',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
