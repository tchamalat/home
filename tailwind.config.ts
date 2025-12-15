import type { Config } from "tailwindcss";

interface DaisyUIConfig extends Config {
  daisyui?: {
    themes?: string[];
    darkTheme?: string;
  };
}

const config: DaisyUIConfig = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "night",
    ],
    darkTheme: "night",
  },
};

export default config;