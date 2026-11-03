import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C8102E",
          crimson: "#E31E36",
          green: "#006A4E",
          dark: "#171717",
          light: "#FFF5F6",
          muted: "#707070",
          success: "#16834A",
          warning: "#E69A17",
          gold: "#D4AF37",
          burgundy: "#580F1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        bangla: ["var(--font-hind-siliguri)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
