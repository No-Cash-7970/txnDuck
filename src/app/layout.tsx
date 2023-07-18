import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { Noto_Sans_Display } from 'next/font/google';
import { Noto_Sans_Mono } from 'next/font/google';
import { Noto_Color_Emoji } from 'next/font/google';

/**
 * TODO: Place these font declarations into a separate file
 */

const notoSans = Noto_Sans({
  style: ['normal', 'italic'],
  weight: ['400', '700'],
  variable: '--font-noto-sans',
  subsets: [ 'cyrillic', 'cyrillic-ext', 'devanagari', 'greek', 'greek-ext', 'latin', 'latin-ext', 'vietnamese', ]
});

const notoSansDisplay = Noto_Sans_Display({
  variable: '--font-noto-sans-display',
  subsets: [ 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'latin', 'latin-ext', 'vietnamese', ]
});

const notoSansMono = Noto_Sans_Mono({
  variable: '--font-noto-sans-mono',
  subsets: [ 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'latin', 'latin-ext', 'vietnamese', ]
});

const notoColorEmoji = Noto_Color_Emoji({
  weight: ['400'],
  variable: '--font-noto-color-emoji',
  subsets: [ 'emoji' ]
});

export const metadata: Metadata = {
  title: 'txnDuck',
  description: 'Tool for creating and sending Algorand transactions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSansDisplay.variable} ${notoSansMono.variable} ${notoColorEmoji.variable}`}
    >
      <body>{children}</body>
    </html>
  );
};
