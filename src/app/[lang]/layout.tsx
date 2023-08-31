import '@/app/globals.css';
import * as fonts from '@/app/lib/fonts';
import type { Metadata, ResolvingMetadata } from 'next';
import JotaiProvider from './components/JotaiProvider';
import { dir } from 'i18next';
import { SUPPORTED_LANGS } from '@/app/i18n/settings';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

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
  return (
    <html
      lang={lang}
      dir={dir(lang)}
      className={
        fonts.notoSans.variable
        + ` ${fonts.notoSansDisplay.variable}`
        + ` ${fonts.notoSansMono.variable}`
        // + ` ${fonts.notoColorEmoji.variable}`
      }
    >
      <body>
        <JotaiProvider>
          <NavBar lng={lang} />
          {children}
          <Footer lng={lang} />
        </JotaiProvider>
      </body>
    </html>
  );
};
