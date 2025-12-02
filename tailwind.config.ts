import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A", // Deep Navy Blue (Profesyonel)
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#059669", // Yeşil (İslami maneviyat - Emerald 600)
          foreground: "#FFFFFF",
        },
        background: "#F8FAFC", // Very light warm gray
      },
    },
  },
  plugins: [],
};
export default config;
