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
        space: {
          950: "#030406",
          900: "#050608",
          850: "#080B10",
          800: "#0D1117",
          700: "#161B22",
        },
        lunar: {
          surface: "#0B0E14",
          crater: "#121824",
          card: "rgba(13, 17, 24, 0.72)",
          cardHover: "rgba(20, 26, 38, 0.85)",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.18)",
          glow: "rgba(56, 189, 248, 0.15)",
        },
        accent: {
          cyan: "#38BDF8",
          sky: "#0EA5E9",
          indigo: "#6366F1",
          violet: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-sora)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #6366F1 0%, #38BDF8 100%)",
        "glass-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "lunar-glass": "0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)",
        "lunar-glass-hover": "0 1px 2px rgba(0, 0, 0, 0.4), 0 20px 44px -8px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.14)",
        "glow-cyan": "0 0 25px rgba(56, 189, 248, 0.25)",
        "glow-indigo": "0 0 25px rgba(99, 102, 241, 0.25)",
      },
      animation: {
        "pulse-glow": "pulseGlow 3s infinite ease-in-out",
        "float-subtle": "floatSubtle 6s infinite ease-in-out",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(0.95)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
