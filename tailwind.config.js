/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#20212b',
        blush: '#f7d8d0',
        sage: '#b8c6ad',
        corn: '#f5cf7c',
        pool: '#9ed2d7',
        plum: '#6f5f7d',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(50, 48, 72, 0.12)',
      },
    },
  },
  plugins: [],
}
