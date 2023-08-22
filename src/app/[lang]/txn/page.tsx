'use client';

import { Trans } from 'react-i18next';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import PageTitleHeading from '@/app/[lang]/components/PageTitleHeading';

export default function TxnTemplatePage({ params: { lang } }: {
  params: { lang: string }
}) {
  const I18N_NS = 'txn_template'; // Namespace for translations
  const { t } = useTranslation(lang, I18N_NS);

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      {t('coming_soon')}
    </main>
  );
}
