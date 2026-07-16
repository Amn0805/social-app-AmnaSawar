/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // toggled via the "dark" class — see index.css
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark (default) surfaces
        midnight: '#0B0F14',
        surface: {
          DEFAULT: '#12181F',
          elevated: '#1A222B',
          border: 'rgba(255,255,255,0.08)',
        },
        // Light-mode surfaces
        cream: '#FAF7F2',
        paperSurface: '#FFFFFF',

        // Text
        paper: '#EAEDF0', // primary text on dark
        ink: '#1A1B23', // primary text on light
        muted: '#8B95A1', // muted text on dark
        mutedLight: '#6B6E7A', // muted text on light

        // Brand — emerald
        brand: {
          50: '#E6FBF4',
          100: '#C3F5E4',
          400: '#3FD9AC',
          500: '#1FB88A',
          600: '#158F6C',
          700: '#0F7A5C',
        },
        // Likes / hearts
        rose: {
          400: '#F58098',
          500: '#F2607D',
          600: '#D94363',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 20px -4px rgba(0,0,0,0.35)',
        card: '0 4px 24px -6px rgba(0,0,0,0.45)',
        'card-hover': '0 12px 32px -8px rgba(31,184,138,0.25)',
        glow: '0 0 0 1px rgba(31,184,138,0.4), 0 0 24px -4px rgba(31,184,138,0.35)',
      },
      keyframes: {
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(31,184,138,0.45)' },
          '70%': { boxShadow: '0 0 0 8px rgba(31,184,138,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(31,184,138,0)' },
        },
        heartBurst: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.4)' },
          '60%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s infinite',
        heartBurst: 'heartBurst 0.4s ease',
        shimmer: 'shimmer 1.4s infinite linear',
        fadeUp: 'fadeUp 0.35s ease-out',
        slideDown: 'slideDown 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
