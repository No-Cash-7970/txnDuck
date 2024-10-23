import { Suspense, use } from 'react';
import { type Metadata } from 'next';
import {
  BuilderSteps,
  PageLoadingPlaceholder,
  PageTitleHeading,
  WalletProvider
} from '@/app/[lang]/components';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import TxnDataTable from './components/TxnDataTable';
import SignTxn from './components/SignTxn';
import TxnImport from './components/TxnImport';

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['sign_txn', 'app']);
  const path = '/txn/sign';
  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: {
      canonical: `/${params.lang}${path}`,
      languages: generateLangAltsMetadata(path)
    },
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['sign']; }

/**  Sign Transaction page */
export default function SignTxnPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);
  const { t } = use(useTranslation(lang, ['sign_txn', 'app']));
  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='sign' />
      <PageTitleHeading lng={lang} showTxnPreset={true}>{t('title')}</PageTitleHeading>
      <Suspense><TxnImport lng={lang} /></Suspense>
      <Suspense fallback={<PageLoadingPlaceholder />}><TxnDataTable lng={lang} /></Suspense>
      <Suspense>
        <WalletProvider sitename={t('site_name')}><SignTxn lng={lang} /></WalletProvider>
      </Suspense>
    </main>
  );
}
