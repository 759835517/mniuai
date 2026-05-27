import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        mniu: {
          bg: "#0D1117",
          panel: "#161B22",
          panelElevated: "#1C2128",
          border: "#30363D",
          text: "#F0F6FC",
          textMuted: "#8B949E",
          blue: "#3B82F6",
          violet: "#8B5CF6",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,0.25), 0 12px 40px rgba(0,0,0,0.35)",
        panel: "0 10px 30px rgba(0,0,0,0.25)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
        "panel-gradient": "linear-gradient(180deg, rgba(22,27,34,0.96) 0%, rgba(13,17,23,0.96) 100%)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pulse-caret": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.25" } },
        "achievement-pop": { "0%": { transform: "scale(0.92)", opacity: "0" }, "70%": { transform: "scale(1.03)", opacity: "1" }, "100%": { transform: "scale(1)", opacity: "1" } },
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out",
        "pulse-caret": "pulse-caret 900ms ease-in-out infinite",
        "achievement-pop": "achievement-pop 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
