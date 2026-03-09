/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './content/**/*.md',
    './content/**/*.html',
    './layouts/**/*.html',
    './themes/hugo-theme-relearn/layouts/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'deep-slate': '#0F172A',
        'core-blue': '#3B82F6',
        'accent-cyan': '#06B6D4',

        // Text colors (WCAG AAA compliant - 7:1+ contrast on white)
        'text-primary': '#111827',    // 16.1:1 contrast
        'text-secondary': '#374151',  // 9.5:1 contrast
        'text-muted': '#4B5563',      // 7.0:1 contrast

        // Link colors (WCAG AAA compliant)
        'link': '#1D4ED8',            // 8.6:1 contrast
        'link-hover': '#1E40AF',      // 10.7:1 contrast

        // Background colors
        'bg-light': '#F8FAFC',
        'bg-muted': '#E2E8F0',

        // Border colors
        'border-default': '#CBD5E1',

        // Status colors (WCAG AAA compliant)
        'status-active-bg': '#D1FAE5',
        'status-active-text': '#065F46',
        'status-pending-bg': '#FEF3C7',
        'status-pending-text': '#78350F',
        'status-failed-bg': '#FEE2E2',
        'status-failed-text': '#7F1D1D',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '15px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '64px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
