/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,scss,sass,less,styl}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        headerBg: 'var(--color-header-bg)',
        headerBorder: 'var(--color-header-border)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        muted: 'var(--color-muted)',
        sectionBg: 'var(--color-section-bg)',
        cardBg: 'var(--color-card-bg)',
        iconBg: 'var(--color-icon-bg)',
      },
    },
  },
  plugins: [],
}; 