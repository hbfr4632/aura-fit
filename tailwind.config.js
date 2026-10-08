export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        electric: {
          400: '#47d6ff',
          500: '#1ad1ff',
          600: '#0fa9d8',
        },
        night: {
          900: '#070b14',
          800: '#101826',
          700: '#152233',
        },
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(26, 209, 255, 0.2), 0 0 35px rgba(26, 209, 255, 0.2)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(26,209,255,0.14) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
