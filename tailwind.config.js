/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    darkTheme: 'duck_dark',
    themes: [
      {
        duck: {
          "primary": "#0ebd9d", // Teal Me No Lies
          "secondary": "#804561", // Notcturn Red
          "accent": "#1346df", // Frosted Blueberries
          "neutral": "#281a1a", // Dark Orchestra
          "base-100": "#ffffff", // White
          "info": "#0b5f82", // Blue Velvet
          "success": "#37630c", // Forest Empress
          "warning": "#e3bf1e", // Oh Em Ghee
          "error": "#ad1f00", // Crimson Velvet Sunset

          "--rounded-box": "0.8rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.4rem", // border radius rounded-btn utility class, used in buttons and similar element
        },
        duck_dark: {
          "primary": "#0ebd9d", // Teal Me No Lies
          "secondary": "#eaa3e7", // Candy Floss
          "accent": "#98bbff", // Sail to the Sea
          "neutral": "#635050", // Chocolate Pretzel
          "base-100": "#332d2d", // Night Rider
          "info": "#4caffa", // Glitter Lake
          "success": "#9abd78", // Pistachio
          "warning": "#e3bf1e", // Oh Em Ghee
          "error": "#de675e", // Happy Hearts

          "--rounded-box": "0.8rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.4rem", // border radius rounded-btn utility class, used in buttons and similar element
        },
      }
    ],
  },
  theme: {
    // extend: {
    //   fontFamily: {
    //     'sans': ['"Noto Sans"', 'sans-serif'],
    //     'serif': ['"Noto Serif"', 'serif'],
    //     'mono': ['"Noto Sans Mono"', 'monospace'],
    //     'display': ['"Noto Sans Display"', '"Noto Sans"', 'sans-serif'],
    //     'emoji': ['"Noto Color Emoji"'],

    //     'sans-jp': ['"Noto Sans"', '"Noto Sans JP"', 'sans-serif'],
    //     'serif-jp': ['"Noto Serif"', '"Noto Serif JP"', 'serif'],
    //     'display-jp': ['"Noto Sans Display"', '"Noto Sans"', '"Noto Sans JP"', 'sans-serif'],
    //   },
    // },
  },
}
