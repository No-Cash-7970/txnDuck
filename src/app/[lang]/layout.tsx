import '@/app/globals.css';
import { use } from 'react';
import type { Metadata } from 'next';
import * as fonts from '@/app/lib/fonts';
import { dir } from 'i18next';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { SUPPORTED_LANGS } from '@/app/i18n/settings';
import {
  Footer,
  JotaiProvider,
  NavBar,
  ToastProvider,
  ToastViewport,
  WalletProvider
} from './components';

/**
 * Generate the base metadata for the site. Parts may be overwritten by child pages.
 */
export async function generateMetadata(
  { params }: { params: { lang: string } }
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'app');

  // Calculate base URL for metadata purposes. This is similar to what Next.js does by default if
  // the metadata base is not specified.
  let metadataBase: string = `http://localhost:${process.env.PORT || 3000}`;
  if (process.env.VERCEL_URL) metadataBase = `https://${process.env.VERCEL_URL}`;
  if (process.env.BASE_URL) metadataBase = `https://${process.env.BASE_URL}`;

  return {
    title: {
      template: `%s | ${t('site_name')}`,
      default: `${t('site_name')}: ${t('description.short')}`,
    },
    description: t('description.long'),
    metadataBase: new URL(metadataBase),
    alternates: generateLangAltsMetadata(),
  };
}

/**
 * For each supported language, make Next JS generate a static page for the language when building
 * the project.
 *
 * @returns List of languages as parameters
 */
export function generateStaticParams(): { lng: string }[] {
  // Output should look something like [ { lng: 'en' }, { lng: 'es' } ]
  return SUPPORTED_LANGS.map((lng) => ({ lng }));
}

export default function RootLayout(
  {
    children,
    params: { lang }
  }: {
    children: React.ReactNode,
    params: { lang?: string }
  }
) {
  const { t } = use(useTranslation(lang || '', 'common'));
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
      </head>
      <body>
        <JotaiProvider>
          <ToastProvider
            swipeDirection={langDir === 'rtl'? 'left' : 'right'}
            label={t('toast.provider_label')}
          >
            <WalletProvider>
              <NavBar lng={lang} />
              {children}
              <ToastViewport
                toastPosition={langDir === 'rtl'? 'left' : 'right'}
                label={t('toast.viewport_label')}
              />
              <Footer lng={lang} />
            </WalletProvider>
          </ToastProvider>
        </JotaiProvider>
      </body>
    </html>
  );
};
