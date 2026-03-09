import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        cream: '#FAF7F2',
        'warm-white': '#FFFCF8',
        sage: { DEFAULT: '#8BAF8D', light: '#C5D9C6', dark: '#5E8561' },
        terra: { DEFAULT: '#C4724A', light: '#EEDDD3' },
        blush: '#E8C4B0',
        sand: '#D4B896',
        'warm-gray': '#7A6E65',
        'light-gray': '#EDE8E2',
        sky: { DEFAULT: '#7B9EC7', light: '#D3E2F0' },
        lavender: '#9B8EC4',
        mint: '#6BB5A0',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
