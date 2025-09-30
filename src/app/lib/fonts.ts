import {
  Noto_Sans,
  Noto_Sans_Display,
  Noto_Sans_Mono,
  // Noto_Color_Emoji,
} from 'next/font/google';

export const notoSans = Noto_Sans({
  style: ['normal', 'italic'],
  weight: ['400', '700'],
  variable: '--font-noto-sans',
  subsets: [
    // 'cyrillic',
    // 'cyrillic-ext',
    // 'devanagari',
    // 'greek',
    // 'greek-ext',
    'latin',
    'latin-ext',
    // 'vietnamese',
  ],
  display: 'swap',
});

export const notoSansDisplay = Noto_Sans_Display({
  variable: '--font-noto-sans-display',
  subsets: [
    // 'cyrillic',
    // 'cyrillic-ext',
    // 'greek',
    // 'greek-ext',
    'latin',
    'latin-ext',
    // 'vietnamese',
  ],
  display: 'swap',
});

export const notoSansMono = Noto_Sans_Mono({
  variable: '--font-noto-sans-mono',
  subsets: [
    // 'cyrillic',
    // 'cyrillic-ext',
    // 'greek',
    // 'greek-ext',
    'latin',
    'latin-ext',
    // 'vietnamese',
  ],
  display: 'swap',
});

// export const notoColorEmoji = Noto_Color_Emoji({
//   weight: ['400'],
//   variable: '--font-noto-color-emoji',
//   subsets: [ 'emoji' ],
//   display: 'swap', // Decreases perceived load time by reducing the "First Contentful Paint" time
// });
