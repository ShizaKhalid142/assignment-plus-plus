/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        instrument: ['Instrument Serif', 'serif'],
        nunito: ['Nunito', 'DIN Round Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        feather: ['Feather Bold', 'Nunito', 'DIN Round Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        'black': '#000000',
        'surface': 'rgba(255, 255, 255, 0.05)',
        'surface-strong': 'rgba(255, 255, 255, 0.12)',
        'accent': '#ffffff',
        'accent-soft': 'rgba(255, 255, 255, 0.72)',
        'accent-strong': 'rgba(255, 255, 255, 0.98)',
        'text-muted': 'rgba(255, 255, 255, 0.68)',
      },
      boxShadow: {
        glow: '0 30px 90px rgba(0, 0, 0, 0.45)',
      },
    }
  },
  plugins: []
};
