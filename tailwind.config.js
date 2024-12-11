/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    darkTheme: 'duck_dark',
    themes: [
      {
        // Color names from: https://colorkit.co/color-picker/
        duck: {
          'primary': '#076554', // Philodendron
          'secondary': '#804561', // Notcturn Red
          'accent': '#1346df', // Frosted Blueberries
          'neutral': '#281a1a', // Dark Orchestra
          'base-100': '#ffffff', // White
          'info': '#0b5f82', // Blue Velvet
          'success': '#37630c', // Forest Empress
          'warning': '#e3bf1e', // Oh Em Ghee
          'error': '#ad1f00', // Crimson Velvet Sunset

          // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-box': '0.8rem',
          // border radius rounded-btn utility class, used in buttons and similar element
          '--rounded-btn': '0.4rem',
        },
        duck_dark: {
          'primary': '#0ebd9d', // Teal Me No Lies
          'secondary': '#eaa3e7', // Candy Floss
          'accent': '#98bbff', // Sail to the Sea
          'neutral': '#635050', // Chocolate Pretzel
          'base-100': '#332d2d', // Night Rider
          'info': '#4caffa', // Glitter Lake
          'success': '#9abd78', // Pistachio
          'warning': '#e3bf1e', // Oh Em Ghee
          'error': '#de675e', // Happy Hearts

          // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-box': '0.8rem',
          // border radius rounded-btn utility class, used in buttons and similar element
          '--rounded-btn': '0.4rem',
        },
      }
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-noto-sans)', 'sans-serif'],
        'display': ['var(--font-noto-sans-display)', 'var(--font-noto-sans)', 'sans-serif'],
        'mono': ['var(--font-noto-sans-mono)', 'monospace'],
        // 'emoji': ['var(--font-noto-color-emoji)'],
        // 'sans-jp': [''Noto Sans'', ''Noto Sans JP'', 'sans-serif'],
        // 'display-jp': [''Noto Sans Display'', ''Noto Sans'', ''Noto Sans JP'', 'sans-serif'],
      },
      keyframes: {
        // For animating Radix UI Toast component when interacting with it
        toastHide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        toastSlideInFromRight: {
          from: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
          to: { transform: 'translateX(0)' },
        },
        toastSlideInFromLeft: {
          from: { transform: 'translateX(calc(0em - 100% - var(--viewport-padding)))' },
          to: { transform: 'translateX(0)' },
        },
        toastSwipeOutToRight: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
        toastSwipeOutToLeft: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(0em - 100% - var(--viewport-padding)))' },
        },
      },
      animation: {
        // For animating Radix UI Toast component when interacting with it
        toastHide: 'toastHide 100ms ease-in',
        toastSlideInFromRight: 'toastSlideInFromRight 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        toastSlideInFromLeft: 'toastSlideInFromLeft 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        toastSwipeOutToRight: 'toastSwipeOutToRight 100ms ease-out',
        toastSwipeOutToLeft: 'toastSwipeOutToLeft 100ms ease-out',
      },
    },
  },
};
