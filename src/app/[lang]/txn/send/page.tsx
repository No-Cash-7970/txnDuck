import { Suspense, use } from 'react';
import { type Metadata } from 'next';
import { BuilderSteps, PageLoadingPlaceholder, PageTitleHeading } from '@/app/[lang]/components';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import SendTxn from './components/SendTxn';

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['send_txn', 'app']);
  const path = '/txn/send';
  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: {
      canonical: `/${params.lang}${path}`,
      languages: generateLangAltsMetadata(path)
    },
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['send']; }

/** Send Transaction page */
export default function SendTxnPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);
  const { t } = use(useTranslation(lang, ['send_txn', 'common']));
  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='send' />
      <PageTitleHeading lng={lang} showTxnPreset={true}>{t('title')}</PageTitleHeading>
      <Suspense fallback={<PageLoadingPlaceholder />}>
        <SendTxn lng={lang} />
      </Suspense>
    </main>
  );
}
