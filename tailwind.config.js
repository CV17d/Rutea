/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "rgba(15, 23, 42, 0.75)",
        surfaceLight: "rgba(255, 255, 255, 0.08)",
        primary: "#10b981", // Emerald green for Live / Active
        primaryDark: "#047857",
        accent: "#38bdf8", // Sky blue for Routes
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#94a3b8"
      },
      borderRadius: {
        "glass": "24px"
      }
    },
  },
  plugins: [],
};
