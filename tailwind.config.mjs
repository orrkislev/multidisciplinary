// /** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        magilio: 'var(--font-magilio)',
        cylburn: 'var(--font-cylburn)',
        geist: 'var(--font-geist-sans)',
        geistMono: 'var(--font-geist-mono)',
        fraunces: 'var(--font-fraunces)',
        frauncesBold: 'var(--font-fraunces-bold)',
        markazi: 'var(--font-markazi-text)',
        caveat: 'var(--font-caveat)',
      },
    },
  },
  plugins: [],
};

export default config;
