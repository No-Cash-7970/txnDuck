import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import { Trans } from 'react-i18next/TransWithoutContext';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import ComposeForm from './components/ComposeForm';

/**
 * Compose Transaction page
 */
export default function ComposeTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, ['compose_txn', 'common']));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='compose' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>

      <p className='max-w-3xl text-sm mt-12 mb-8'>
        <Trans t={t} i18nKey='instructions'>
          asterisk_fields (<span className='text-error'>*</span>) required
        </Trans>
      </p>

      <ComposeForm lng={lang} />
    </main>
  );
}
