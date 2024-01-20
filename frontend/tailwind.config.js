/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#B5E2FA",
        "secondary": "#0FA3B1",
        "lightYellow": "#F9F7F3"
      }
    },
  },
  plugins: [],
};

