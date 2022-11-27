/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // enable tailwind just in time
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-1': '#cfff70',
        'green-2': '#8fde5d',
        'green-3': '#3ca370',
        'green-4': '#3d6e70',
        'green-5': '#323e4f',
        'gray-1': '#c2c2d1',
        'gray-2': '#7e7e8f',
        'gray-3': '#606070',
        'gray-4': '#43434f',
        'gray-5': '#272736',
        'red-1': '#ff9166',
        'red-2': '#eb564b',
        'red-3': '#b0305c',
        'red-4': '#73275c',
        'red-5': '#422445',
        'custom-black': '#171525'
      }
    }
  },
  plugins: []
}
