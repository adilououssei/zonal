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
          DEFAULT: '#0B6B3A',
          dark: '#064A27',
          light: '#2E9E55',
        },
        red: {
          DEFAULT: '#C62026',
          hover: '#A8181E',
        },
        gray: {
          50: '#F7F8FA',
          100: '#E5E7EB',
          600: '#666666',
          900: '#222222',
        },
        white: '#FFFFFF',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        hero: '56px',
        section: '42px',
        subtitle: '22px',
        body: '17px',
        small: '15px',
        button: '16px',
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
}