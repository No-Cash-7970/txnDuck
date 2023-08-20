import '@/app/globals.css';
import * as fonts from './lib/fonts';
import type { Metadata, ResolvingMetadata } from 'next';
import JotaiProvider from './components/JotaiProvider';
import { dir } from 'i18next';
import { SUPPORTED_LANGS } from '@/app/i18n/settings';
import { useTranslation } from '@/app/i18n';
import NavBar from './components/NavBar';

export async function generateMetadata(
  { params }: { params: { lang: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'app');

  return {
    title: `${t('site_name')}: ${t('description.short')}`,
    description: t('description.long'),
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
  return (
    <html
      lang={lang}
      dir={dir(lang)}
      className={
        fonts.notoSans.variable
        + ` ${fonts.notoSansDisplay.variable}`
        + ` ${fonts.notoSansMono.variable}`
        + ` ${fonts.notoColorEmoji.variable}`
      }
    >
      <body>
        <JotaiProvider>
          <NavBar lng={lang} />
          {children}
        </JotaiProvider>
      </body>
    </html>
  );
};
