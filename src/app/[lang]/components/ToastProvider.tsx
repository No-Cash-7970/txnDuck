'use client';

import { Provider } from '@radix-ui/react-toast';

/**
 *  Wrapper for the Radix UI Toast Provider to convert it to a client component so it is compatible
 *  with Next.js server-side rendering (SSR)
 */
export default function ToastProvider({
  children,
  swipeDirection,
  label,
}: {
  children: React.ReactNode,
  swipeDirection?: 'right' | 'left',
  label?: string,
}) {
  return (
     // The left swipe direction is usually for when the language is (right-to-left) RTL
    <Provider swipeDirection={swipeDirection} label={label}>
      {children}
    </Provider>
  );
};
