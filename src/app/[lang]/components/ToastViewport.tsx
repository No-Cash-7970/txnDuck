'use client';

import { Viewport } from '@radix-ui/react-toast';

/** Wrapper for the Radix UI Toast Viewport to convert it to a client component so it is compatible
 *  with Next.js server-side rendering (SSR)
 */
export default function ToastViewport({
  toastPosition,
  label,
}: {
  toastPosition?: 'right' | 'left',
  label?: string,
}) {
  if (toastPosition === 'left') { // Usually for when the language is (right-to-left) RTL
    return (
      <Viewport label={label} className='toast toast-top z-[1000] whitespace-normal toast-start' />
    );
  } else { // Default
    return (
      <Viewport label={label} className='toast toast-top z-[1000] whitespace-normal toast-end' />
    );
  }
};
