/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        secondary: '#50E3C2',
        accent: '#F5A623',
        background: '#F7F9FA',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}
