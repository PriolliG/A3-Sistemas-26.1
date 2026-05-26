/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,営業}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F4F4',
        primaria: '#11224D',
        neonCiano: '#00F2FE',
        neonRosa: '#F355DA',
        riscoBaixo: '#00E676',
        riscoMedio: '#FFD600',
        riscoAlto: '#FF1744',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}