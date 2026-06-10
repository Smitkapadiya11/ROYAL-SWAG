/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F4EDD6",
        primary: "#324023",
        "primary-container": "#495738",
        "on-primary": "#ffffff",
        "on-primary-container": "#bccca5",
        "ayurvedic-gold": "#9A6F1A",
        gold: "#9A6F1A",
        "deep-forest": "#495738",
        surface: "#f5fce7",
        "surface-container": "#e9f1dc",
        "surface-container-high": "#e3ebd6",
        "surface-container-highest": "#dee5d1",
        "on-surface": "#171e11",
        "on-surface-variant": "#45483f",
        outline: "#75786e",
        "outline-variant": "#c5c8bc",
        "glass-surface": "rgba(255,255,255,0.4)",
        "glass-border": "rgba(255,255,255,0.6)",
        "inverse-surface": "#2c3325",
        "inverse-on-surface": "#ecf4df",
        "inverse-primary": "#bccca5",
        "surface-tint": "#556343",
        "primary-fixed": "#d8e8c0",
        "primary-fixed-dim": "#bccca5",
        error: "#ba1a1a",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        number: ["DM Sans", "var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      spacing: {
        "margin-mobile": "var(--container-pad-mobile)",
        "margin-desktop": "var(--container-pad-desktop)",
        "section-gap": "var(--section-gap-desktop)",
        "section-gap-mobile": "var(--section-gap-mobile)",
        gutter: "var(--grid-gap)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
      borderRadius: {
        "layout-sm": "var(--radius-sm)",
        "layout-md": "var(--radius-md)",
        "layout-lg": "var(--radius-lg)",
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
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-hover)",
        glass: "0 8px 32px rgba(50, 64, 35, 0.08)",
        "btn-primary-hover": "0 4px 12px rgba(154, 111, 26, 0.3)",
      },
    },
  },
  plugins: [],
};
