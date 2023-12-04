import '@/app/globals.css';
import type { Metadata } from 'next';

/** Generate the base metadata for the site. Parts may be overwritten by child pages. */
export async function generateMetadata(): Promise<Metadata> {
  // Calculate base URL for metadata purposes. This is similar to what Next.js does by default if
  // the metadata base is not specified.
  let metadataBase: string = `http://localhost:${process.env.PORT || 3000}`;
  if (process.env.VERCEL_URL) metadataBase = `https://${process.env.VERCEL_URL}`;
  if (process.env.BASE_URL) metadataBase = `https://${process.env.BASE_URL}`;

  return { metadataBase: new URL(metadataBase) };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
};
