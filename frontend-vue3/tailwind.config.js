//const colors = require('tailwindcss/colors')

const {url} = require("generate-random-data/lib/random/network");

module.exports = {
  // paths to all of your pages and components so Tailwind can tree-shake unused styles in production builds
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        jet: {
          light: "#5e5e5e",
          DEFAULT: "#252525",
          dark: "#101010",
        },
        ming: {
          light: "#7eaeb1",
          DEFAULT: "#3c6e71",
          dark: "#275658",
        },
        indigo_dye: {
          light: "#4381aa",
          DEFAULT: "#284b63",
          dark: "#192f3e",
        },

      },
      fontFamily: {
        // Poppins is a free google font that is linked in the index.html page
        sans: ["Poppins, sans-serif"],
      },
      backgroundImage: theme => ({
        'top-curve-indigo': "url('/images/curve-top-indigo.svg')",
        'center-curve-indigo': "url('/images/curve-centered-indigo.svg')",
      })
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      opacity: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
