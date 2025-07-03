/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Colores de Meridian Consulting
        primary: {
          DEFAULT: '#33619D',
          light: '#4A78B4',
          dark: '#264C7D',
        },
        secondary: {
          DEFAULT: '#FCF7FF',
          dark: '#E9E4EC',
        },
        tertiary: {
          DEFAULT: '#63C9DB',
          light: '#8AD7E5',
          dark: '#4BA0AF',
        },
        accent: {
          DEFAULT: '#F4D35E',
          light: '#F7DE85',
          dark: '#c7a41a',
        },
        background: '#FCF7FF',
        dark: {
          DEFAULT: '#04080F',
          alt: '#122236',
        }
      },
      fontFamily: {
        primary: ['Roboto', 'sans-serif'],
        secondary: ['Open Sans', 'sans-serif'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        'xxl': '3rem',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.12)',
        'md': '0 4px 6px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px rgba(0,0,0,0.1)',
      },
      transitionTimingFunction: {
        'fast': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'normal': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'slow': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '0.2s',
        'normal': '0.3s',
        'slow': '0.5s',
      }
    },
  },
  plugins: [],
} 