import '@/app/globals.css';
import { use } from 'react';
import type { Metadata } from 'next';
import * as fs from "node:fs";
import { dir } from 'i18next';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { supportedLangs } from '@/app/i18n/settings';
import * as fonts from '@/app/lib/fonts';
import { getMetadataBase } from '@/app/lib/utils';
import {
  Footer,
  JotaiProvider,
  NavBar,
  ToastProvider,
  ToastViewport,
} from './components';

/** Generate the base metadata for the site. Parts may be overwritten by child pages. */
export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'app');
  return {
    title: t('home_page_title', {site: t('site_name'), slogan: t('description.short')}),
    description: t('description.long'),
    alternates: {
      canonical: `/${params.lang}`,
      languages: generateLangAltsMetadata()
    },
    manifest: `/assets/manifest-${params.lang}.webmanifest`,
    openGraph: {
      images: [
        {
          url: `${getMetadataBase()}/${params.lang}/opengraph-image.png`, // Must be an absolute URL
          width: 1200,
          height: 630,
          alt: t('home_page_title', {site: t('site_name'), slogan: t('description.short')}),
        },
      ]
    },
  };
}

/** For each supported language, make Next JS generate a static page for the language when building
 * the project.
 * @returns List of languages as parameters
 */
export async function generateStaticParams(): Promise<{ lang: string }[]> {
  // Loop through each supported language to output something like
  // `[ { lang: 'en' }, { lang: 'es' } ]` while generating a manifest file for each language.
  // The manifest file enables this website to be a Progressive Web App (PWA). Depending on the
  // browser, this web app may or may not be a separate PWA for each language. Either situation is
  // fine.
  return await Promise.all(Object.keys(supportedLangs).map(async (lang) => {
    const { t } = await useTranslation(lang, 'app');
    const manifestData = {
      short_name: t('site_name'),
      name: t('home_page_title', {site: t('site_name'), slogan: t('description.short')}),
      start_url: `/${lang}`,
      display: 'standalone',
      background_color: '#332d2d', // "base-100" color for dark mode theme in tailwind.config.js
      theme_color: '#332d2d', // "base-100" color for dark mode theme in tailwind.config.js
      icons: [
        // Icons created using: https://realfavicongenerator.net/
        { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        // Maskable icons created using: https://maskable.app/editor
        { src: '/assets/icon-192-maskable.png',
          sizes: '192x192', type: 'image/png', purpose: 'maskable'
        },
        { src: '/assets/icon-512-maskable.png',
          sizes: '512x512', type: 'image/png', purpose: 'maskable'
        },
      ],
    };
    fs.writeFileSync(`public/assets/manifest-${lang}.webmanifest`, JSON.stringify(manifestData));

    return ({ lang });
  }));
}

export default function HomeLayout(
  props: {
    children: React.ReactNode,
    params: Promise<{ lang?: string }>
  }
) {
  const params = use(props.params);
  const { lang } = params;
  const { children } = props;
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
           *
           * NOTE: If you change something here, also update the theme-switcher and the not-found
           * page if necessary.
           */
          // eslint-disable-next-line max-len
          __html: `document.querySelector('html').dataset.theme = JSON.parse(localStorage.getItem('theme')) || ''`,
        }} />

        {/*  Set app name & icon, they appear when connecting a wallet to this app */}
        <meta name='name' content={t('site_name')} />
        {/* Note: Pera wallet grabs the first <link> with a rel that contains "icon" in it  */}
        <link rel="wallet-icon" href="/favicon.ico" />

        {/* Add some icon and brand color information. Generated (with modification) using:
          * https://realfavicongenerator.net/
          */}
        <link rel='mask-icon' href='/assets/silhouette-icon.svg' color='#0ebd9d'/>
        <meta name='msapplication-TileColor' content='#332d2d' />
        <meta name='theme-color' content='#332d2d' />
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
