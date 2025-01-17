/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'card': 'hsl(0 0% 100%)',
        'card-foreground': 'hsl(222.2 84% 4.9%)',
      }
    },
  },
  plugins: [],
}
