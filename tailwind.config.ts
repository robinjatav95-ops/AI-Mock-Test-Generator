import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF6",
        ink: "#161A22",
        "ink-soft": "#535A68",
        "ink-faint": "#8B8F98",
        navy: {
          DEFAULT: "#1F3A5F",
          deep: "#152B47",
          light: "#3A5A82",
        },
        amber: {
          DEFAULT: "#E2A03D",
          deep: "#C7862A",
          pale: "#FBEBCE",
        },
        line: "#E5E1D6",
        card: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22, 26, 34, 0.04), 0 8px 24px -12px rgba(22, 26, 34, 0.12)",
        lifted: "0 4px 8px rgba(22, 26, 34, 0.05), 0 20px 40px -16px rgba(22, 26, 34, 0.18)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
