/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'dark-text': '#1F2B2E',
        'light-text': '#FFFFFF',
        'subtitle': '#999999',
        'background': '#F8F8F8',
        'selected': '#E2A364',
        'positive': '#2ECC71',
        'negative': '#C0392B',
      },     
      fontFamily: {
        'helvetica': ['Helvetica', 'sans-serif'],
        'helvetica-bold': ['Helvetica-Bold', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'poppins-medium': ['Poppins-Medium', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'inter-medium': ['Inter-Medium', 'sans-serif'],
      },
      fontSize: {
        'xs': ['10px', { lineHeight: '10px' }], // footer
        'sm': ['12px', { lineHeight: '16px' }], // subtitle
        'base': ['14px', { lineHeight: '20px' }], // title2
        'lg': ['18px', { lineHeight: '16px' }], // title1
        'xl': ['24px', { lineHeight: '16px' }], // headline1
        '2xl': ['32px', { lineHeight: '40px' }], // headline2
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'bold': '700',
      },
      letterSpacing: {
        'normal': '0',
        'wide': '0.02em',
        'wider': '0.05em',
      },
    },
  },
  plugins: [],
};