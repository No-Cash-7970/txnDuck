'use client';

import { useEffect } from 'react';
import NotFoundBody from './NotFoundBody';

/** 404 Not Found page */
export default function NotFound() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const htmlElem = document.querySelector('html');

    if (theme) {
      htmlElem!.dataset.theme = theme;
    } else {
      // Unset the `data-theme` attribute if the theme is to be automatic
      delete htmlElem!.dataset.theme;
    }
  });
  return (
    <main className='prose min-h-screen mx-auto pt-8 px-4 pb-12 flex flex-col items-center'>
      <NotFoundBody />
    </main>
  );
}
