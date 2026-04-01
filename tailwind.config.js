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
        forest: {
          DEFAULT: "hsl(var(--forest))",
          light: "hsl(var(--forest-light))",
        },
        lime: {
          DEFAULT: "hsl(var(--lime))",
          glow: "hsl(var(--lime-glow))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        page: "var(--bg-page)",
        card: "var(--bg-card)",
        "card-hover": "var(--bg-card-hover)",
        "image-stevia": "var(--bg-image-stevia)",
        "image-monk": "var(--bg-image-monk)",
        "txt-primary": "var(--text-primary)",
        "txt-secondary": "var(--text-secondary)",
        "txt-muted": "var(--text-muted)",
        "txt-green": "var(--text-green)",
        "acc-green": "var(--accent-green)",
        "acc-dark": "var(--accent-dark)",
        "acc-light": "var(--accent-light)",
        "acc-amber": "var(--accent-amber)",
        "bdr-card": "var(--border-card)",
        "bdr-active": "var(--border-active)",
        "pill-inactive-bg": "var(--pill-inactive-bg)",
        "pill-inactive-border": "var(--pill-inactive-border)",
        "pill-active-bg": "var(--pill-active-bg)",
        "pill-active-border": "var(--pill-active-border)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        squircle: "1.5rem",
        "squircle-sm": "1rem",
        "squircle-lg": "2rem",
        "squircle-xl": "2.5rem",
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
}

