/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan:   '#00f5ff',
          purple: '#bf5af2',
          pink:   '#ff2d78',
          green:  '#39ff14',
        },
        dark: {
          950: '#020408',
          900: '#060d18',
          800: '#0d1a2e',
          700: '#122040',
          600: '#1a2d55',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #020408 0%, #060d18 40%, #0d1a2e 100%)',
        'neon-glow':     'radial-gradient(ellipse at center, rgba(0,245,255,0.15) 0%, transparent 70%)',
        'card-glass':    'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'neon-cyan':   '0 0 20px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.1)',
        'neon-purple': '0 0 20px rgba(191,90,242,0.4), 0 0 60px rgba(191,90,242,0.1)',
        'neon-pink':   '0 0 20px rgba(255,45,120,0.4), 0 0 60px rgba(255,45,120,0.1)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,245,255,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(0,245,255,0.6), 0 0 80px rgba(0,245,255,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
