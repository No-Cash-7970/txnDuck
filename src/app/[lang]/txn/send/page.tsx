import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import SendTxn from './components/SendTxn';

/**
 * Send Transaction page
 */
export default function SendTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'send_txn'));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='send' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      <SendTxn lng={lang} />
    </main>
  );
}
