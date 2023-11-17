import { Suspense, use } from 'react';
import { useTranslation } from '@/app/i18n';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import ComposeForm from './components/ComposeForm';
import ComposeFormLoading from './components/ComposeFormLoading';

/** Compose Transaction page */
export default function ComposeTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, ['compose_txn', 'common']));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='compose' />
      <PageTitleHeading lng={lang} showTxnPreset={true}>{t('title')}</PageTitleHeading>
      <Suspense fallback={<ComposeFormLoading />}>
        <ComposeForm lng={lang} />
      </Suspense>
    </main>
  );
}
