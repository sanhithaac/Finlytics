/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        soft: "0 24px 60px rgba(2, 6, 23, 0.45)",
      },
      fontFamily: {
        sans: ['"Roboto"', '"Segoe UI Variable"', '"Trebuchet MS"', "sans-serif"],
        display: ['"Roboto"', '"Segoe UI Variable"', '"Trebuchet MS"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
