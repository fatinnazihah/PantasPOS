/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-yellow': '#FEF9C3', // yellow-100
        'baby-blue': '#BFDBFE',   // blue-200
        'deep-blue': '#1E3A8A',   // blue-900
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}