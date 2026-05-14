/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  colors: {
    primary: "#0E4F3A",
    secondary: "#1B3A2F",
    gold: "#C9A24D",
    goldLight: "#E6C87A",

    dark: "#0B1F1A",
    lightBg: "#F8FAF9",
  },

  fontFamily: {
    heading: ["var(--font-playfair)"],
    body: ["var(--font-montserrat)"],
  },

  boxShadow: {
    card: "0 4px 20px rgba(0,0,0,0.05)",
    soft: "0 2px 10px rgba(0,0,0,0.08)",
  },

  borderRadius: {
    xl: "14px",
  },
},
  },
  plugins: [],
};