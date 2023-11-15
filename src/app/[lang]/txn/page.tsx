import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import Link from 'next/link';
import { IconArrowBigRightLinesFilled, IconArrowBigLeftLinesFilled } from '@tabler/icons-react';
import { PageTitleHeading } from '@/app/[lang]/components';
import TxnPresetsList from './TxnPresetsList';

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
