'use client';

import { Provider } from 'jotai';

/** Wrapper for the Jotai provider to convert it to a client component so it is compatible with
 *  Next.js server-side rendering (SSR)
 */
export default function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
};
