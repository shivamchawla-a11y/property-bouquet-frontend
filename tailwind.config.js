/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0E4F3A",     // Emerald Green
        secondary: "#1B3A2F",   // Forest Green
        gold: "#C9A24D",        // Champagne Gold
        goldLight: "#E6C87A",   // Soft Gold

        // extra UI shades (makes UI feel premium)
        dark: "#0B1F1A",
        lightBg: "#F8FAF9",
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