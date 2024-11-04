import type { Config } from "tailwindcss";
import safeArea from "tailwindcss-safe-area";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        },
        // 추가된 figma
        white: "var(--white)",
        primary50: "var(--primary-50)",
        primary100: "var(--primary-100)",
        primary200: "var(--primary-200)",
        primary300: "var(--primary-300)",
        primary400: "var(--primary-400)",
        primary500: "var(--primary-500)",
        primary600: "var(--primary-600)",
        primary700: "var(--primary-700)",
        primary800: "var(--primary-800)",
        primary900: "var(--primary-900)",
        secondary50: "var(--secondary-50)",
        secondary100: "var(--secondary-100)",
        secondary200: "var(--secondary-200)",
        secondary300: "var(--secondary-300)",
        secondary400: "var(--secondary-400)",
        secondary500: "var(--secondary-500)",
        secondary600: "var(--secondary-600)",
        secondary700: "var(--secondary-700)",
        secondary800: "var(--secondary-800)",
        secondary900: "var(--secondary-900)",
        gray50: "var(--gray-50)",
        gray100: "var(--gray-100)",
        gray200: "var(--gray-200)",
        gray300: "var(--gray-300)",
        gray400: "var(--gray-400)",
        gray500: "var(--gray-500)",
        gray600: "var(--gray-600)",
        gray700: "var(--gray-700)",
        gray800: "var(--gray-800)",
        gray900: "var(--gray-900)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontSize: {
        sm: "var(--font-sm)",
        base: "var(--font-base)",
        lg: "var(--font-lg)",
        xl: "var(--font-xl)",
        "2xl": "var(--font-2xl)",
        "3xl": "var(--font-3xl)",
        "4xl": "var(--font-4xl)",
        "5xl": "var(--font-5xl)",
        "6xl": "var(--font-6xl)",
        "7xl": "var(--font-7xl)"
      },
      fontFamily: {
        suit: "var(--font-family-suit)",
        pretendard: "var(--font-family-pretendard)"
      },
      boxShadow: {
        category: "var(--shadow-category)",
        review: "var(--shadow-review)",
        background: "var(--shadow-background)",
        challengeTab: "var(--shadow-challenge-tab)"
      }
    }
  },
  plugins: [safeArea, require("tailwindcss-animate")]
};
export default config;
