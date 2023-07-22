'use client';

import { useEffect } from 'react';
import { IconMoodWink2 } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '../lib/app_settings';
import { useTranslation } from '../i18n/client';
import { Trans } from 'react-i18next';
import Link from 'next/link';

export default function Home({ params: { lng } }: {
  params: {
    lng: string;
  };
}) {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  const i18nNS = 'home'; // Namespace for translations
  const { t, i18n } = useTranslation(lng, i18nNS);

  // Set dark mode by setting the "data-theme" attribute in the upper-level <html> tag
  useEffect(() => {
    const htmlElem: (HTMLHtmlElement | null) = document.querySelector('html');

    if (htmlElem !== null) {
      htmlElem.dataset.theme = darkMode;
      console.log(`Switched to ${darkMode}`);
    }
  }, [darkMode]);

  return (
    <main className="prose bg-base-100 max-w-none min-h-screen p-4">
      <h1 className="text-primary text-center mt-8">
        <span className="align-middle">{t('greeting')}</span>
        <IconMoodWink2 strokeWidth={2} className="inline h-10 w-10 align-middle ms-2" />
      </h1>
      <p className="max-w-4xl px-4 mx-auto text-center">
        <Trans i18nKey="duck_soon" ns={i18nNS}>
          txn<span className="text-primary">Duck</span> will be coming soon!
        </Trans>
      </p>
      <p className="max-w-4xl px-4 mx-auto text-center italic">
        <Trans i18nKey="code_on_github" ns={i18nNS}>
          Check out the <code className='p-0'>code</code> on
          <a href="https://github.com/No-Cash-7970/txnDuck">Github</a>.
        </Trans>
      </p>
      <p className="max-w-4xl px-4 mx-auto text-center font-emoji text-8xl mt-10 mb-20">
        🦆
      </p>
      <div className='flex justify-center gap-x-10 gap-y-6 flex-wrap'>
      {/* Theme */}
      <div className="flex flex-col items-center">
        <label className="label" htmlFor="light-mode-options block">
          <span className="label-text">{t('theme_switcher.label')}</span>
        </label>
        <div className="join">
          <input
            className={
              'join-item'
              + ' btn btn-sm'
              + ' checked:!bg-secondary checked:!text-secondary-content checked:!border-secondary'
              + ' checked:hover:!bg-secondary-focus checked:hover:!border-secondary-focus'
            }
            type="radio"
            name="dark-mode-options"
            aria-label={t('theme_switcher.light')}
            defaultChecked={darkMode === 'duck'}
            onClick={() => setDarkMode('duck')}
          />
          <input
            className={
              'join-item'
              + ' btn btn-sm'
              + ' checked:!bg-secondary checked:!text-secondary-content checked:!border-secondary'
              + ' checked:hover:!bg-secondary-focus checked:hover:!border-secondary-focus'
            }
            type="radio"
            name="dark-mode-options"
            aria-label={t('theme_switcher.dark')}
            defaultChecked={darkMode === 'duck_dark'}
            onClick={() => setDarkMode('duck_dark')}
          />
          <input
            className={
              'join-item'
              + ' btn btn-sm'
              + ' checked:!bg-secondary checked:!text-secondary-content checked:!border-secondary'
              + ' checked:hover:!bg-secondary-focus checked:hover:!border-secondary-focus'
            }
            type="radio"
            name="dark-mode-options"
            aria-label={t('theme_switcher.auto')}
            defaultChecked={darkMode === ''}
            onClick={() => setDarkMode('')}
          />
        </div>
      </div>
      {/* Language */}
      {process.env.NEXT_PUBLIC_FEAT_LANG_SWITCHER?.toLowerCase() !== 'false' &&
        <div className="flex flex-col items-center">
          <label className="label" htmlFor="light-mode-options block">
            <span className="label-text">{t('language_switcher_label')}</span>
          </label>
          <div className="join">
            <Link
              className={`join-item btn btn-sm ${lng==='en' && 'btn-primary'}`}
              href={`/en`}
            >
              English
            </Link>
            <Link
              className={`join-item btn btn-sm ${lng==='es' && 'btn-accent'}`}
              href={`/es`}
            >
              Español
            </Link>
          </div>
        </div>
      }
      </div>
    </main>
  );
};
