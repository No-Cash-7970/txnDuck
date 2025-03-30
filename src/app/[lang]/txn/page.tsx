import { Suspense, use } from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { IconArrowBigRightLinesFilled, IconArrowBigLeftLinesFilled } from '@tabler/icons-react';
import { PageLoadingPlaceholder, PageTitleHeading } from '@/app/[lang]/components';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import TxnPresetsList from './TxnPresetsList';

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['txn_presets', 'app']);
  const path = '/txn';
  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: {
      canonical: `/${params.lang}${path}`,
      languages: generateLangAltsMetadata(path)
    },
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['txn']; }

/** Choose Transaction Presets page */
export default function TxnPresetsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);
  const { t } = use(useTranslation(lang, 'txn_presets'));
  return (
    <main className='prose max-w-6xl min-h-screen mx-auto pt-8 px-4 pb-12'>
      <PageTitleHeading>{t('title')}</PageTitleHeading>
      <p className='text-center text-lg mb-3'>{t('instruction')}</p>
      <div className='flex justify-center'>
        <Link
          href={`/${lang}/txn/compose`}
          className={'btn btn-block btn-accent'
            + ' text-lg h-auto py-1 max-w-3xl leading-tight flex-wrap'
          }
        >
          <IconArrowBigRightLinesFilled aria-hidden className='rtl:hidden' />
          <IconArrowBigLeftLinesFilled aria-hidden className='hidden rtl:block' />
          {t('skip_btn')}
        </Link>
      </div>
      <Suspense fallback={<PageLoadingPlaceholder />}><TxnPresetsList lng={lang} /></Suspense>
    </main>
  );
}
