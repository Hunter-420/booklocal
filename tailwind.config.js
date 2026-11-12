/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EF',
        forest: {
          DEFAULT: '#1F4D3F',
          hover: '#2C6652',
          dark: '#14201B',
        },
        ink: {
          DEFAULT: '#1F2A24',
          muted: '#6B7A72',
        },
        sand: {
          DEFAULT: '#F0E6D8',
          light: '#F5F0E8',
          line: '#E8DDCB',
        },
        mint: {
          DEFAULT: '#E3F1E8',
          dark: '#2D6B4E',
        },
        terracotta: '#E07A5F',
        tan: {
          DEFAULT: '#C9A27E',
          text: '#8A6742',
        },
      },
      fontFamily: {
        heading: ['Fraunces', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        button: '12px',
        card: '20px',
      },
    },
  },
  plugins: [],
}
