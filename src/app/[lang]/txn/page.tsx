import { use } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import Link from 'next/link';
import { PageTitleHeading } from '@/app/[lang]/components';
import { type Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'txn_template');

  return {
    title: t('title'),
    alternates: generateLangAltsMetadata('/txn'),
  };
}

/**
 * Choose Transaction Template page
 */
export default function TxnTemplatePage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'txn_template'));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      {t('coming_soon')}
    </main>
  );
}
