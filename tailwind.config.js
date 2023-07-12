/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
  darkMode: "class", 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        burtons: "burtons",
      }
    },
    colors: {
      transparent: "transparent", 
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      blue: colors.blue,
      yellow: colors.yellow,
      green: colors.green,
      teal: colors.teal,
      indigo: colors.indigo,
      cyan: colors.cyan,
      emerald: colors.emerald,
      neutral: colors.neutral,
      custom: {
        space: "#484A47",
        flame: "#DD6031",
        powder: "#E0FBFC",
      }
    }
  },
  plugins: [],
}