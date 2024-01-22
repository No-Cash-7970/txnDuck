import { Suspense, use } from 'react';
import { type Metadata } from 'next';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { BuilderSteps, PageTitleHeading, WalletProvider } from '@/app/[lang]/components';
import TxnDataTable from './components/TxnDataTable';
import SignTxn from './components/SignTxn';
import SignTxnLoading from './components/SignTxnLoading';
import TxnImport from './components/TxnImport';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
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
export default function SignTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, ['sign_txn', 'app']));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='sign' />
      <PageTitleHeading lng={lang} showTxnPreset={true}>{t('title')}</PageTitleHeading>
      <TxnImport lng={lang} />
      <TxnDataTable lng={lang} />
      <Suspense fallback={<SignTxnLoading />}>
        <WalletProvider sitename={t('site_name')}><SignTxn lng={lang} /></WalletProvider>
      </Suspense>
    </main>
  );
}
