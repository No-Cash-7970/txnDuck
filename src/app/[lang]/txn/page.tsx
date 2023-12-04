import { use } from 'react';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { type Metadata } from 'next';
import Link from 'next/link';
import { IconArrowBigRightLinesFilled, IconArrowBigLeftLinesFilled } from '@tabler/icons-react';
import { PageTitleHeading } from '@/app/[lang]/components';
import TxnPresetsList from './TxnPresetsList';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['txn_presets', 'app']);

  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: generateLangAltsMetadata('/txn'),
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['txn']; }

/** Choose Transaction Presets page */
export default function TxnPresetsPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'txn_presets'));

  return (
    <main className='prose max-w-6xl min-h-screen mx-auto pt-8 px-4 pb-12'>
      <PageTitleHeading>{t('title')}</PageTitleHeading>
      <p className='text-center text-lg mb-3'>{t('instruction')}</p>
      <div className='flex justify-center'>
        <Link
          href={`/${lang}/txn/compose`}
          className={'btn btn-sm btn-block btn-accent'
            +' normal-case font-normal text-lg h-auto max-w-3xl'
          }
        >
          <IconArrowBigRightLinesFilled aria-hidden className='rtl:hidden' />
          <IconArrowBigLeftLinesFilled aria-hidden className='hidden rtl:block' />
          {t('skip_btn')}
        </Link>
      </div>

      <TxnPresetsList lng={lang} />
    </main>
  );
}
