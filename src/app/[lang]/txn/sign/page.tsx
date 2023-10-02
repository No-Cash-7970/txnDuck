import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import Link from 'next/link';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import TxnDataTable from './components/TxnDataTable';
import SignTxn from './components/SignTxn';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

/**
 * Sign Transaction page
 */
export default function SignTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'sign_txn'));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='sign' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      <TxnDataTable lng={lang} />

      {/* Buttons */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 grid-rows-1 mx-auto mt-12'>
        <div>
          <button className='btn btn-primary w-full' disabled={true} tabIndex={-1}>
            {t('send_txn_btn')}
            <IconArrowRight aria-hidden className='rtl:hidden' />
            <IconArrowLeft aria-hidden className='hidden rtl:inline' />
          </button>
        </div>
        <div className='sm:order-first'>
          <Link href={`/${lang}/txn/compose`} className='btn w-full'>
            <IconArrowLeft aria-hidden className='rtl:hidden' />
            <IconArrowRight aria-hidden className='hidden rtl:inline' />
            {t('compose_txn_btn')}
          </Link>
          <div className='alert bg-base-100 gap-1 border-0 py-0 mt-2'>
            <IconAlertTriangleFilled
              aria-hidden
              className='text-warning align-middle my-auto me-2'
            />
            <small>{t('compose_txn_btn_warning')}</small>
          </div>
        </div>
      </div>
    </main>
  );
}
