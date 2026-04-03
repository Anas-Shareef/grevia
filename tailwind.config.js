/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
    "./app/Filament/**/*.php",
    "./resources/views/filament/**/*.blade.php",
    "./vendor/filament/**/*.blade.php",
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
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2E7D32",
          foreground: "#F5F2EA",
        },
        secondary: {
          DEFAULT: "#E8E4D8",
          foreground: "#2E7D32",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#8E8E8E",
          foreground: "#1A2E1A",
        },
        accent: {
          DEFAULT: "#A3E635",
          foreground: "#1A2E1A",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A2E1A",
        },
        forest: {
          DEFAULT: "#2E7D32",
          light: "#3E8E42",
        },
        lime: {
          DEFAULT: "#A3E635",
          glow: "#B2F040",
        },
        cream: {
          DEFAULT: "#F5F2EA",
          dark: "#E8E4D8",
        },
      },
      borderRadius: {
        lg: "1.5rem",
        md: "1rem",
        sm: "0.5rem",
        squircle: "1.5rem",
        "squircle-sm": "1rem",
        "squircle-lg": "2rem",
        "squircle-xl": "3rem",
        "squircle-2xl": "4rem",
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
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blob: "blob 7s infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

