/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f4c5c',
          dark: '#0a3744',
          light: '#1a6478',
          hover: '#15576a',
        },
        accent: {
          DEFAULT: '#fcaf17',
          dark: '#e89d00',
          light: '#fdc54f',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
