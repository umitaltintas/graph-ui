/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4F46E5", // Light primary color
          DEFAULT: "#3B82F6", // Default primary color
          dark: "#2563EB", // Dark primary color
        },
        secondary: {
          DEFAULT: "#10B981", // Secondary color
        },
      },
      backgroundColor: {
        "dark-primary": "#1E293B",
        "dark-secondary": "#0F172A",
      },
      textColor: {
        "light-primary": "#F3F4F6",
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
  darkMode: "media", // or 'media' if you prefer to use media query
};
