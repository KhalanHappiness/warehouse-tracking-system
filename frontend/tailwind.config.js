/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Gold
          dark: '#B8960E',
          light: '#F4E5B0',
        },
        navy: {
          DEFAULT: '#1A2332',
          dark: '#0F1419',
          light: '#2D3748',
        },
        accent: {
          blue: '#4A90E2',
          green: '#10B981',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
