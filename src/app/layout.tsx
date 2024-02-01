import '@/app/globals.css';
import type { Metadata } from 'next';
import { getMetadataBase } from '@/app/lib/utils';

/** Generate the base metadata for the site. Parts may be overwritten by child pages. */
export async function generateMetadata(): Promise<Metadata> {
  return { metadataBase: new URL(getMetadataBase()) };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
};
