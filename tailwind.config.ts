const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette enrichie basée sur DaisyUI (light & night)
        base: {
          DEFAULT: 'hsl(var(--b1) / <alpha-value>)',
          100: 'hsl(var(--b1) / 1)',
          80: 'hsl(var(--b1) / 0.8)',
          60: 'hsl(var(--b1) / 0.6)',
          40: 'hsl(var(--b1) / 0.4)',
          20: 'hsl(var(--b1) / 0.2)',
        },
        primary: {
          DEFAULT: 'hsl(var(--p) / <alpha-value>)',
          100: 'hsl(var(--p) / 1)',
          80: 'hsl(var(--p) / 0.8)',
          60: 'hsl(var(--p) / 0.6)',
          40: 'hsl(var(--p) / 0.4)',
          20: 'hsl(var(--p) / 0.2)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--s) / <alpha-value>)',
          100: 'hsl(var(--s) / 1)',
          80: 'hsl(var(--s) / 0.8)',
          60: 'hsl(var(--s) / 0.6)',
          40: 'hsl(var(--s) / 0.4)',
          20: 'hsl(var(--s) / 0.2)',
        },
        accent: {
          DEFAULT: 'hsl(var(--a) / <alpha-value>)',
          100: 'hsl(var(--a) / 1)',
          80: 'hsl(var(--a) / 0.8)',
          60: 'hsl(var(--a) / 0.6)',
          40: 'hsl(var(--a) / 0.4)',
          20: 'hsl(var(--a) / 0.2)',
        },
        neutral: {
          DEFAULT: 'hsl(var(--n) / <alpha-value>)',
          100: 'hsl(var(--n) / 1)',
          80: 'hsl(var(--n) / 0.8)',
          60: 'hsl(var(--n) / 0.6)',
          40: 'hsl(var(--n) / 0.4)',
          20: 'hsl(var(--n) / 0.2)',
        },
        info: {
          DEFAULT: 'hsl(var(--in) / <alpha-value>)',
          100: 'hsl(var(--in) / 1)',
          80: 'hsl(var(--in) / 0.8)',
          60: 'hsl(var(--in) / 0.6)',
          40: 'hsl(var(--in) / 0.4)',
          20: 'hsl(var(--in) / 0.2)',
        },
        success: {
          DEFAULT: 'hsl(var(--su) / <alpha-value>)',
          100: 'hsl(var(--su) / 1)',
          80: 'hsl(var(--su) / 0.8)',
          60: 'hsl(var(--su) / 0.6)',
          40: 'hsl(var(--su) / 0.4)',
          20: 'hsl(var(--su) / 0.2)',
        },
        warning: {
          DEFAULT: 'hsl(var(--wa) / <alpha-value>)',
          100: 'hsl(var(--wa) / 1)',
          80: 'hsl(var(--wa) / 0.8)',
          60: 'hsl(var(--wa) / 0.6)',
          40: 'hsl(var(--wa) / 0.4)',
          20: 'hsl(var(--wa) / 0.2)',
        },
        error: {
          DEFAULT: 'hsl(var(--er) / <alpha-value>)',
          100: 'hsl(var(--er) / 1)',
          80: 'hsl(var(--er) / 0.8)',
          60: 'hsl(var(--er) / 0.6)',
          40: 'hsl(var(--er) / 0.4)',
          20: 'hsl(var(--er) / 0.2)',
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "light"],
    darkTheme: "dark",
  },
} as any;

export default config;
