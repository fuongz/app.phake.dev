const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.zinc,
          900: "#000000",
          800: "#1f1f1f",
          700: "#2e2e2e",
          600: "#313131",
          500: "#969593",
          400: "#a6a6a6",
          300: "#bdbbb7",
          200: "#f1f1f1",
          100: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
