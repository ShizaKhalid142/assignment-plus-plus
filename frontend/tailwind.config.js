/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#001F54',
          800: '#003D82',
          700: '#005BBD',
          600: '#1a6fd1',
          100: '#e8f1ff'
        }
      }
    }
  },
  plugins: []
};
