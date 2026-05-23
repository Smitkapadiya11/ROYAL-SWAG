/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#324023",
          container: "#495738",
        },
        gold: "#9A6F1A",
        parchment: "#F4EDD6",
        surface: {
          DEFAULT: "#f5fce7",
          container: "#e9f1dc",
        },
        "on-surface": {
          DEFAULT: "#171e11",
          variant: "#45483f",
        },
        glass: "rgba(255,255,255,0.4)",
        "glass-border": "rgba(255,255,255,0.6)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-hanken)", "Hanken Grotesk", "system-ui", "sans-serif"],
      },
      borderRadius: {
        glass: "16px",
        btn: "12px",
      },
      backdropBlur: {
        glass: "12px",
      },
      transitionTimingFunction: {
        glass: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(50, 64, 35, 0.08)",
        "btn-primary-hover": "0 4px 12px rgba(154, 111, 26, 0.3)",
      },
    },
  },
  plugins: [],
};
