import { use } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import Link from 'next/link';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import { type Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'sign_txn');

  return {
    title: t('title'),
    alternates: generateLangAltsMetadata('/txn/sign'),
  };
}

/**
 * Sign Transaction page
 */
export default function SignTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'sign_txn'));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='sign' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      {t('coming_soon')}
    </main>
  );
}
