/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '101': '1.005',
      },

      colors: {
        blue: '#1A91FF'
      }
    }
  },

  darkMode: 'class',

  plugins: [],
}