'use client';

import { useEffect } from 'react';
import NotFoundBody from './NotFoundBody';

/** 404 Not Found page */
export default function NotFound() {
  useEffect(() => {
    document.querySelector('html')!.dataset.theme =
      JSON.parse(localStorage.getItem('theme')!) || '';
  });
  return (
    <main className='prose min-h-screen mx-auto pt-8 px-4 pb-12 flex flex-col items-center'>
      <NotFoundBody />
    </main>
  );
}
