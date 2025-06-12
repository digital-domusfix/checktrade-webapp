// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#FCF8F0',
        primary: '#166A34',
        'primary-hover': '#14572C',
        'primary-accent': '#166A34',
        'primary-muted': '#166A34',
        'brand-gray': '#CED4DA',
        error: '#D9534F',
        green: {
          DEFAULT: '#166A34',
          light: '#166A34',
          muted: '#166A34',
          dark: '#166A34',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      scrollBehavior: ['responsive'],
    },
  },
  plugins: [],
};
