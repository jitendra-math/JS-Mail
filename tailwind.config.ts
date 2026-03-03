// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0b0c10",
        panel: "#0f1115",
        border: "rgba(255,255,255,0.06)",
        primary: "#3b82f6"
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 20px rgba(59,130,246,0.35)"
      },
      backdropBlur: {
        xs: "2px"
      }
    },
  },
  plugins: []
};

export default config;