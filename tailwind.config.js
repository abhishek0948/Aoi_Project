/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569',
          light: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
