/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f7',
          100: '#d3ebeb',
          200: '#a8d7d8',
          300: '#72bcbf',
          400: '#3f9ba1',
          500: '#25808a',
          600: '#1a6672',
          700: '#17525d',
          800: '#16434c',
          900: '#173a41',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae3',
          300: '#b0bacb',
          400: '#8593ad',
          500: '#657590',
          600: '#505d76',
          700: '#424b60',
          800: '#3a4051',
          900: '#343846',
          950: '#21232c',
        },
        accent: {
          50: '#fdf3ee',
          100: '#fae4d6',
          200: '#f5c6ad',
          300: '#eea079',
          400: '#e5764b',
          500: '#d95b31',
          600: '#c04323',
          700: '#9f3320',
          800: '#7f2c1f',
          900: '#66291e',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(21, 27, 38, 0.04), 0 8px 24px rgba(21, 27, 38, 0.06)',
        lift: '0 2px 6px rgba(21, 27, 38, 0.06), 0 16px 40px rgba(21, 27, 38, 0.10)',
      },
      borderRadius: {
        xl2: '1.125rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'scan-line': 'scan-line 2.4s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};