import './globals.css';
import type { Metadata } from 'next';
import {
  notoSans,
  notoSansDisplay,
  notoSansMono,
  notoColorEmoji,
} from './lib/fonts';

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
