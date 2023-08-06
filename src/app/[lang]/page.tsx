'use client';

import { useEffect } from 'react';
import { IconMoodWink2 } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { darkModeAtom, ThemeModes } from './lib/app_settings';
import { useTranslation } from '../i18n/client';
import { Trans } from 'react-i18next';
import Link from 'next/link';

export default function Home({ params: { lang } }: {
  params: { lang: string }
}) {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  const I18N_NS = 'home'; // Namespace for translations
  const { t, i18n } = useTranslation(lang, I18N_NS);

  // Set dark mode by setting the "data-theme" attribute in the upper-level <html> tag
  useEffect(() => {
    const htmlElem: (HTMLHtmlElement | null) = document.querySelector('html');

    if (htmlElem !== null) {
      htmlElem.dataset.theme = darkMode;
      console.log(`Switched to ${darkMode}`);
    }
  }, [darkMode]);

  return (
    <main className="prose max-w-none min-h-screen p-4">
      <h1 className="text-primary text-center mt-8">
        <span className="align-middle">{t('greeting')}</span>
        <IconMoodWink2 strokeWidth={2} className="inline h-10 w-10 align-middle ms-2" />
      </h1>
      <p className="max-w-4xl px-4 mx-auto text-center">
        <Trans i18nKey="duck_soon" ns={I18N_NS}>
          txn<span className="text-primary">Duck</span>_coming_soon
        </Trans>
      </p>
      <p className="max-w-4xl px-4 mx-auto text-center italic">
        <Trans i18nKey="code_on_github" ns={I18N_NS}>
          check_out_the_<code className='p-0'>code</code>_on
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
            defaultChecked={darkMode === ThemeModes.light}
            onClick={() => setDarkMode(ThemeModes.light)}
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
            defaultChecked={darkMode === ThemeModes.dark}
            onClick={() => setDarkMode(ThemeModes.dark)}
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
            defaultChecked={darkMode === ThemeModes.auto}
            onClick={() => setDarkMode(ThemeModes.auto)}
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
              className={`join-item btn btn-sm ${lang==='en' && 'btn-primary'}`}
              href={`/en`}
            >
              English
            </Link>
            <Link
              className={`join-item btn btn-sm ${lang==='es' && 'btn-accent'}`}
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
