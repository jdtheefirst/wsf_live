import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: (theme: any) => ({
        dark: {
          css: {
            color: theme("colors.foreground"),
            a: { color: theme("colors.primary") },
            strong: { color: theme("colors.foreground") },
            h1: { color: theme("colors.foreground") },
            h2: { color: theme("colors.foreground") },
            h3: { color: theme("colors.foreground") },
            h4: { color: theme("colors.foreground") },
            blockquote: { color: theme("colors.muted.foreground") },
            code: { color: theme("colors.foreground") },
          },
        },
      }),
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundColor: {
        DEFAULT: "hsl(var(--background))",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      textColor: {
        DEFAULT: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        rotateSwitch: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "40%": { transform: "rotate(-15deg)" },
          "80%": { transform: "rotate(10deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pop: {
          "0%": { transform: "scale(1)", opacity: "0" },
          "30%": { transform: "scale(1.3)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        popping: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5%)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "led-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "led-chase": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "led-ease": {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(90deg)" }, // Slow through corners
          "50%": { transform: "rotate(180deg)" },
          "75%": { transform: "rotate(270deg)" }, // Slow through corners
          "100%": { transform: "rotate(360deg)" },
        },
        // Option 1 Keyframes
        punchLeft: {
          "0%, 100%": { transform: "rotate(0deg) translateX(0)" },
          "50%": { transform: "rotate(-45deg) translateX(-8px)" },
        },
        punchRight: {
          "0%, 100%": { transform: "rotate(0deg) translateX(0)" },
          "50%": { transform: "rotate(45deg) translateX(8px)" },
        },
        stanceLeft: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "50%": { transform: "translateX(-4px) rotate(-10deg)" },
        },
        stanceRight: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "50%": { transform: "translateX(4px) rotate(10deg)" },
        },

        // Option 2 Keyframes
        beltProgress: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.5",
          },
          "50%": {
            transform: "scale(1.2)",
            opacity: "1",
          },
        },

        // Option 3 Keyframes
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        kataBody: {
          "0%": { height: "2rem" },
          "25%": { height: "1.5rem" },
          "50%": { height: "2rem", transform: "translateX(-0.5rem)" },
          "75%": { height: "2.5rem" },
          "100%": { height: "2rem" },
        },
        kataArms: {
          "0%": { transform: "translateX(-50%) rotate(0deg)", width: "3rem" },
          "25%": {
            transform: "translateX(-50%) rotate(45deg)",
            width: "2.5rem",
          },
          "50%": {
            transform: "translateX(-50%) rotate(-45deg)",
            width: "3rem",
          },
          "75%": { transform: "translateX(-50%) rotate(90deg)", width: "2rem" },
          "100%": { transform: "translateX(-50%) rotate(0deg)", width: "3rem" },
        },
        kataLegs: {
          "0%": { transform: "translateX(-50%) rotate(0deg)" },
          "25%": { transform: "translateX(-50%) rotate(15deg)" },
          "50%": { transform: "translateX(-50%) rotate(-15deg)" },
          "75%": { transform: "translateX(-50%) rotate(30deg)" },
          "100%": { transform: "translateX(-50%) rotate(0deg)" },
        },
        textCycle: {
          "0%, 25%": { opacity: "1", content: '"Ready Stance"' },
          "26%, 50%": { opacity: "1", content: '"Block & Strike"' },
          "51%, 75%": { opacity: "1", content: '"Turning Defense"' },
          "76%, 100%": { opacity: "1", content: '"Final Form"' },
        },
      },
      animation: {
        "led-ease": "led-ease 5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "led-spin": "led-spin 5s linear infinite",
        "led-chase": "led-chase 4.5s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pop: "pop 0.5s ease-out",
        popping: "popping 0.6s ease-out",
        "bounce-slow": "bounce-slow 2s infinite",
        rotateSwitch: "rotateSwitch 0.5s linear",
        fade: "fade 1.2s ease-in forwards",
        "fade-in": "fade 0.8s ease-in-out forwards",
        wiggle: "wiggle 0.2s ease-in-out infinite",
        // Option 1 Animations
        "punch-left": "punchLeft 1.5s ease-in-out infinite",
        "punch-right": "punchRight 1.5s ease-in-out infinite 0.75s",
        "stance-left": "stanceLeft 2s ease-in-out infinite",
        "stance-right": "stanceRight 2s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "pulse-subtle": "pulse 2s ease-in-out infinite",

        // Option 2 Animations
        "belt-progress": "beltProgress 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "spin-medium": "spin 2s linear infinite reverse",

        // Option 3 Animations
        breathe: "breathe 2s ease-in-out infinite",
        "kata-body": "kataBody 4s ease-in-out infinite",
        "kata-arms": "kataArms 4s ease-in-out infinite",
        "kata-legs": "kataLegs 4s ease-in-out infinite",
        "text-cycle": "textCycle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
  ],
};

export default config;
