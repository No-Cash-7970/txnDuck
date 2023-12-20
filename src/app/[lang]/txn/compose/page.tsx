import { use } from 'react';
import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import {
  ExtraSmallField,
  FullWidthField,
  LargeAreaField,
  SwitchField
} from './components/fields/LoadingPlaceholders';

const ComposeForm = dynamic(() => import('./components/ComposeForm'),
  { ssr: false,
    loading: () =>
      <div className='max-w-2xl mx-auto mt-12'>
        <div className='skeleton rounded-md h-4 max-w-md mt-4 mb-8'></div>
        <ExtraSmallField />
        <FullWidthField containerClass='mt-6' />
        <SwitchField containerClass='max-w-xs mt-6' />
        <LargeAreaField containerClass='mt-6' />
        <SwitchField containerClass='max-w-xs mt-6' />
      </div>
  },
);

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['compose_txn', 'app']);
  const path = '/txn/compose';
  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: {
      canonical: `/${params.lang}${path}`,
      languages: generateLangAltsMetadata(path)
    },
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['compose']; }

/** Compose Transaction page */
export default function ComposeTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, ['compose_txn', 'common']));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='compose' />
      <PageTitleHeading lng={lang} showTxnPreset={true}>{t('title')}</PageTitleHeading>
      <ComposeForm lng={lang} />
    </main>
  );
}
