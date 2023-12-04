import { Suspense, use } from 'react';
import { type Metadata } from 'next';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import ComposeForm from './components/ComposeForm';
import ComposeFormLoading from './components/ComposeFormLoading';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['compose_txn', 'app']);

  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: generateLangAltsMetadata('/txn/compose'),
  };
}

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
