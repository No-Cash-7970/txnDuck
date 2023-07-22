import '../globals.css';
import type { Metadata, ResolvingMetadata } from 'next';
import {
  notoSans,
  notoSansDisplay,
  notoSansMono,
  notoColorEmoji,
} from '../lib/fonts';
import { JotaiProvider } from '../lib/providers';
import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import { useTranslation } from '../i18n';

type Props = {
  params: { lng: string },
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Read route param for language
  const lng: string = params.lng;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, 'translation');

  return {
    title: `${t('site_name')} - ${t('metadata.title')}`,
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
    params: { lng }
  }: {
    children: React.ReactNode,
    params: { lng?: string }
  }
) {
  return (
    <html
      lang={lng}
      dir={dir(lng)}
      className={
        notoSans.variable
        + ` ${notoSansDisplay.variable}`
        + ` ${notoSansMono.variable}`
        + ` ${notoColorEmoji.variable}`
      }
      data-theme=""
    >
      <body>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
};
