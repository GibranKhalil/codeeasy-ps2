/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-1': '#121214',
        'dark-2': '#19191B',
        'dark-3': '#222326',
        'dark-4': '#292A2E',
        'dark-5': '#303136',
        'dark-6': '#393A40',
        'dark-7': '#46484F',
        'dark-8': '#5F606A',
        'dark-9': '#6C6E79',
        'dark-10': '#797B86',
        'dark-11': '#B2B3BD',
        'dark-12': '#EEEEF0',
        'primary-1--dark': '#0C121E',
        'primary-2--dark': '#101727',
        'primary-3--dark': '#15244B',
        'primary-4--dark': '#192E65',
        'primary-5--dark': '#203878',
        'primary-6--dark': '#294388',
        'primary-7--dark': '#32509D',
        'primary-8--dark': '#3A5DB8',
        'primary-9--dark': '#3461E5',
        'primary-10--dark': '#395BB5',
        'primary-11--dark': '#8EB4FF',
        'primary-12--dark': '#D3E2FF',
        'accent-red-10': '#D63941',
      },
      animation: {
        'ripple': 'ripple 1s ease-out forwards',
      },
      keyframes: {
        ripple: {
          'to': {
            transform: 'translate(-50%, -50%) scale(4)',
            opacity: '0',
          },
        },
      }
    },
  },
  plugins: [],
}