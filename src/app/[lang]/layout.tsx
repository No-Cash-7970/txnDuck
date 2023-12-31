import '@/app/globals.css';
import { use } from 'react';
import type { Metadata } from 'next';
import * as fonts from '@/app/lib/fonts';
import { dir } from 'i18next';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { supportedLangs } from '@/app/i18n/settings';
import {
  Footer,
  JotaiProvider,
  NavBar,
  ToastProvider,
  ToastViewport,
} from './components';

/** Generate the base metadata for the site. Parts may be overwritten by child pages. */
export async function generateMetadata(
  { params }: { params: { lang: string } }
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'app');

  return {
    title: t('home_page_title', {site: t('site_name'), slogan: t('description.short')}),
    description: t('description.long'),
    alternates: {
      canonical: `/${params.lang}`,
      languages: generateLangAltsMetadata()
    },
  };
}

/** For each supported language, make Next JS generate a static page for the language when building
 * the project.
 * @returns List of languages as parameters
 */
export function generateStaticParams(): { lang: string }[] {
  // Output should look something like [ { lng: 'en' }, { lng: 'es' } ]
  return Object.keys(supportedLangs).map((lang) => ({ lang }));
}

export default function HomeLayout(
  {
    children,
    params: { lang }
  }: {
    children: React.ReactNode,
    params: { lang?: string }
  }
) {
  const { t } = use(useTranslation(lang || '', ['app', 'common']));
  const langDir = dir(lang);

  return (
    <html
      lang={lang}
      dir={langDir}
      className={
        fonts.notoSans.variable
        + ` ${fonts.notoSansDisplay.variable}`
        + ` ${fonts.notoSansMono.variable}`
        // + ` ${fonts.notoColorEmoji.variable}`
      }
      suppressHydrationWarning={process.env.SUPPRESS_HYDRATION_WARNINGS === 'true'}
    >
      <head>
        <script dangerouslySetInnerHTML={{
          /*
           * Apply the theme before everything is loaded to avoid the annoying flicker caused by
           * the user using a theme that is not the default. Doing this causes a hydration warning
           * that can be safely suppressed.
           * NOTE: If you change something here, also update the theme-switcher if necessary.
           */
          // eslint-disable-next-line max-len
          __html: `document.querySelector('html').dataset.theme = JSON.parse(localStorage.getItem('theme')) || ''`,
        }} />

        {/*  Set app name, the name that appears when connecting a wallet to this app */}
        <meta name='name' content={t('site_name')} />
      </head>
      <body>
        <JotaiProvider>
          <ToastProvider
            swipeDirection={langDir === 'rtl'? 'left' : 'right'}
            label={t('toast.provider_label')}
          >
            <NavBar lng={lang} />
            {children}
            <ToastViewport
              toastPosition={langDir === 'rtl'? 'left' : 'right'}
              label={t('toast.viewport_label')}
            />
            <Footer lng={lang} />
          </ToastProvider>
        </JotaiProvider>
      </body>
    </html>
  );
};
