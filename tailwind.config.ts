import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Extra romantic accent tones beyond Tailwind's built-in rose palette
        romantic: {
          blush: '#fce7f3',
          petal: '#fbcfe8',
          heart: '#e11d48',
          velvet: '#9f1239',
          cream: '#fff1f2',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        romantic: '0 4px 24px -4px rgba(225, 29, 72, 0.18)',
        'romantic-lg': '0 8px 40px -6px rgba(225, 29, 72, 0.25)',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/line-clamp'), // included in Tailwind v3.3+
  ],
};

export default config;
