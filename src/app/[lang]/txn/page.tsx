import { use } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { useTranslation } from '@/app/i18n';
import Link from 'next/link';
import PageTitleHeading from '@/app/[lang]/components/PageTitleHeading';

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
