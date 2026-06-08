/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5ff',
          100: '#e8f1ff',
          200: '#c4d8ff',
          300: '#93b4f5',
          400: '#648cdf',
          500: '#3a63c4',
          600: '#1a6fd1',
          700: '#005BBD',
          800: '#003D82',
          900: '#001F54',
        }
      }
    }
  },
  plugins: []
};
