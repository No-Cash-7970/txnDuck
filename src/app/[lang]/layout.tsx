import '../globals.css';
import * as fonts from './lib/fonts';
import type { Metadata, ResolvingMetadata } from 'next';
import JotaiProvider from './components/JotaiProvider';
import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import { useTranslation } from '../i18n';

type Props = {
  params: { lang: string },
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'translation');

  return {
    title: `${t('site_name')} | ${t('metadata.title')}`,
    description: t('metadata.description'),
  };
}

// NOTE: This function was copied from
// https://github.com/i18next/next-13-app-dir-i18next-example-ts/blob/main/app/%5Blng%5D/layout.tsx
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
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
      data-theme=""
    >
      <body>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
};
