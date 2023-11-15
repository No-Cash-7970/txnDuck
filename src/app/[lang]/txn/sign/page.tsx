import { Suspense, use } from 'react';
import { useTranslation } from '@/app/i18n';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import TxnDataTable from './components/TxnDataTable';
import SignTxn from './components/SignTxn';

/**  Sign Transaction page */
export default function SignTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'sign_txn'));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='sign' />
      <PageTitleHeading lng={lang} showTxnPreset={true}>{t('title')}</PageTitleHeading>
      <TxnDataTable lng={lang} />
      <Suspense><SignTxn lng={lang} /></Suspense>
    </main>
  );
}
