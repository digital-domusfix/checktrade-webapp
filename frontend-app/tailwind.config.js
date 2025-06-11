// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#FFFFFF', // dominant background
        cream: '#FFFEF6',             // ultra-light cream
        'cream-muted': '#FFFBEA',     // soft section bg
        'green-main': '#99EE99',      // primary CTA
        'green-hover': '#C7F6B6',     // hover states
        'green-accent': '#5DC972',    // icons, trust marks
        'green-muted': '#E2FAB5', 
        green: {
          DEFAULT: '#99EE99', // main green
          light: '#C7F6B6',   // hover state, icons
          muted: '#E2FAB5',   // soft tags, info pills
          dark: '#6BCB77',    // active buttons, highlights
        },
      },
      scrollBehavior: ['responsive'],
    },
  },
  plugins: [],
};
