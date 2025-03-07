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
        'primary-blue': '#3461E5',
        'dark-secondary': '#1E1E1E',
        'neutral-gray': '#B2B3BD',
        'dark-gray': '#393A40',
      },
    },
  },
  plugins: [],
}