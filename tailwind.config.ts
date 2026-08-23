import type { Config } from "tailwindcss";

// Paleta oficial PsPrime — manter proporção ~90% neutros / ~10% azul.
// O azul é reservado para ações (CTAs, links importantes, ícones ativos).
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05070B",
        surface: "#0B0F16",
        primary: {
          DEFAULT: "#1677FF",
          light: "#3B8CFF",
        },
        text: {
          DEFAULT: "#F5F7FA",
          muted: "#A7AFBC",
        },
        border: "#202733",
        success: "#22C55E",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Escala global de cantos arredondados — nada de cantos vivos no site.
        // Cards/modais/banners: rounded-2xl. Inputs: rounded-xl (Tailwind nativo). Botões/badges: rounded-full.
        card: "1rem",
      },
      backdropBlur: {
        glass: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
