'use client';

import { useEffect } from 'react';
import { IconMoodWink2 } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { darkModeAtom } from './lib/app_settings';

export default function Home() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  useEffect(() => {
    /*
     * Set dark mode by setting the "data-theme" attribute in the upper-level <html> tag
     */
    const htmlElem: (HTMLHtmlElement | null) = document.querySelector('html');

    if (htmlElem !== null) {
      htmlElem.dataset.theme = darkMode;
      console.log(`Switched to ${darkMode}`);
    }
  }, [darkMode]);

  return (
    <main className="prose bg-base-100 max-w-none min-h-screen p-4">
      <h1 className="text-primary text-center">
        <span className="align-middle">Hello!</span>
        <IconMoodWink2 strokeWidth={2} className="inline h-10 w-10 align-middle ms-2" />
      </h1>
      <p className="max-w-4xl px-4 mx-auto text-center">
        txn<span className="text-primary">Duck</span> will be coming soon!
      </p>
      <p className="max-w-4xl px-4 mx-auto text-center italic">
        Check out the <code className='p-0'>code</code> on <a href="https://github.com/No-Cash-7970/txnDuck">Github</a>.
      </p>
      <p className="max-w-4xl px-4 mx-auto text-center font-emoji text-8xl mt-8">
        🦆
      </p>
      <div className="flex flex-col items-center">
        <label className="label" htmlFor="light-mode-options block">
          <span className="label-text">Theme mode</span>
        </label>
        <div className="join">
          <input
            className="join-item btn btn-sm"
            type="radio"
            name="dark-mode-options"
            aria-label="Light"
            defaultChecked={darkMode === 'duck'}
            onClick={() => setDarkMode('duck')}
          />
          <input
            className="join-item btn btn-sm"
            type="radio"
            name="dark-mode-options"
            aria-label="Dark"
            defaultChecked={darkMode === 'duck_dark'}
            onClick={() => setDarkMode('duck_dark')}
          />
          <input
            className="join-item btn btn-sm"
            type="radio"
            name="dark-mode-options"
            aria-label="Automatic"
            defaultChecked={darkMode === ''}
            onClick={() => setDarkMode('')}
          />
        </div>
      </div>
    </main>
  );
};
