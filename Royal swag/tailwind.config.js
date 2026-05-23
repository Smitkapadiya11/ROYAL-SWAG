/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#324023",
        gold: "#9A6F1A",
        parchment: "#F4EDD6",
        surface: "#f5fce7",
        glass: "rgba(255,255,255,0.4)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-hanken)", "Hanken Grotesk", "system-ui", "sans-serif"],
      },
      backdropBlur: { glass: "12px" },
      transitionTimingFunction: { glass: "cubic-bezier(0.25, 0.8, 0.25, 1)" },
    },
  },
  plugins: [],
};
