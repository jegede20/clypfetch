import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#14121A", 2: "#211E29", 3: "#2A2733" },
        paper: { DEFAULT: "#FBF7F0", dim: "#EFE9DD" },
        violet: { DEFAULT: "#8B5CF6", deep: "#6D3FE0" },
        coral: { DEFAULT: "#FF6452", deep: "#E84A38" },
        lime: { DEFAULT: "#C8F169", deep: "#A9DA3E" },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      // Pill Stack — sharp-edge variant: no true pills/circles, only a
      // 2-4px anti-alias radius is ever allowed.
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "2px",
        md: "3px",
        lg: "4px",
        xl: "4px",
        "2xl": "4px",
        "3xl": "4px",
        full: "4px",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatb: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        floatc: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        barpulse: {
          "0%,100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 4.2s ease-in-out infinite",
        floatb: "floatb 5.1s ease-in-out infinite",
        floatc: "floatc 3.6s ease-in-out infinite",
        barpulse: "barpulse 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
