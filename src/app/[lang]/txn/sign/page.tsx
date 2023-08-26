import { use } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { useTranslation } from '@/app/i18n';
import Link from 'next/link';
import BuilderSteps from '@/app/[lang]/components/BuilderSteps';
import PageTitleHeading from '@/app/[lang]/components/PageTitleHeading';

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
