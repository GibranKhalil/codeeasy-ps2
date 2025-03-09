/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#121212',
        'light-gray': '#E0E0E0',
        'primary': '#3461E5',
        'primary-20': 'rgba(52, 97, 229, 0.2)',
        'dark-secondary': '#1E1E1E',
        'dark-secondary-30': 'rgba(30, 30, 30, 0.3)',
        'neutral-gray': '#B2B3BD',
        'dark-gray': '#393A40',
      },
    },
  },
  plugins: [],
}