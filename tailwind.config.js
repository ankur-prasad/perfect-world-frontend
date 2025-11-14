/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e27',
        space: '#1a1f3a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a8c1',
        'accent-primary': '#4d7c8a',
        'accent-secondary': '#f4a261',
        success: '#2ecc71',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['3rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
        '5xl': '128px',
      },
      maxWidth: {
        'container': '1440px',
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
        'spin-slower': 'spin 90s linear infinite',
      },
    },
  },
  plugins: [],
}
