/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0052cc",
        "primary-light": "#0066ff",
        secondary: "#f7f8fa",
        "text-secondary": "#626061",
        border: "#e1e0df",
        success: "#36a853",
        warning: "#f2cc0c",
        danger: "#e01e5a",
        info: "#0099d3",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
        md: "0 2px 8px rgba(0, 0, 0, 0.12)",
        lg: "0 4px 16px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

