/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#F9A23B',
        background: '#FFF4EA',
        lavender: '#D8C3FF',
        pink: '#FFC8D8',
        sky: '#BDEFFF',
        mint: '#CFF5DC',
        text: '#1F2937',
        muted: '#6B7280',
        card: '#FFFFFF',
        border: '#000000',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.08)',
        card: '0 6px 16px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
