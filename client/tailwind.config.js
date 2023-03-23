/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xxs: ["0.625rem", { lineHeight: "120%", letterSpacing: "0.03em" }],
      xs: ["0.75rem", { lineHeight: "120%", letterSpacing: "0.03em" }],
      s: ["0.875rem", { lineHeight: "120%", letterSpacing: "0.03em" }],
      m: ["1rem", { lineHeight: "120%", letterSpacing: "0.03em" }],
      l: ["1.125rem", { lineHeight: "120%", letterSpacing: "0.03em" }],
      xl: ["1.25rem", { lineHeight: "120%", letterSpacing: "0.03em" }],
      xxl: ["1.5rem", { lineHeight: "120%", letterSpacing: "0.03em" }],
    },
    extend: {
      colors: {
        blue: {
          100: "#aab8e8",
          200: "#9cace5",
          300: "#8ea0e1",
          400: "#6874f3",
          500: "#5865F2",
          600: "#667bc4",
          700: "#5b6dae",
          800: "#4f5f98",
          900: "#445282",
        },
        gray: {
          200: "#dfe0e1",
          300: "#DCDDDE",
          400: "#c6c6c7",
          500: "#424549",
          600: "#313338",
          700: "#2B2D31",
          800: "#232428",
          900: "#292B2F",
        },
        red: {
          500: "#ED4245",
        },
      },
      boxShadow: {
        "elevation-low": "0px 1px 0px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
