import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Map directly to CSS variables so non-HSL values (hex/rgb/gradients) work
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        'scale-xs': 'calc(0.75rem * var(--scale-factor))',
        'scale-sm': 'calc(0.875rem * var(--scale-factor))',
        'scale-base': 'calc(1rem * var(--scale-factor))',
        'scale-lg': 'calc(1.125rem * var(--scale-factor))',
        'scale-xl': 'calc(1.25rem * var(--scale-factor))',
        'scale-2xl': 'calc(1.5rem * var(--scale-factor))',
        'scale-3xl': 'calc(1.875rem * var(--scale-factor))',
        'scale-4xl': 'calc(2.25rem * var(--scale-factor))',
        'scale-5xl': 'calc(3rem * var(--scale-factor))',
        'scale-6xl': 'calc(3.75rem * var(--scale-factor))',
      },
      spacing: {
        'scale-1': 'calc(0.25rem * var(--scale-factor))',
        'scale-2': 'calc(0.5rem * var(--scale-factor))',
        'scale-3': 'calc(0.75rem * var(--scale-factor))',
        'scale-4': 'calc(1rem * var(--scale-factor))',
        'scale-5': 'calc(1.25rem * var(--scale-factor))',
        'scale-6': 'calc(1.5rem * var(--scale-factor))',
        'scale-8': 'calc(2rem * var(--scale-factor))',
        'scale-10': 'calc(2.5rem * var(--scale-factor))',
        'scale-12': 'calc(3rem * var(--scale-factor))',
        'scale-16': 'calc(4rem * var(--scale-factor))',
        'scale-20': 'calc(5rem * var(--scale-factor))',
        'scale-24': 'calc(6rem * var(--scale-factor))',
        'scale-32': 'calc(8rem * var(--scale-factor))',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
