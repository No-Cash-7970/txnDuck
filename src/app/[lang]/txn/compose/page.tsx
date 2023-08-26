import { use } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { useTranslation } from '@/app/i18n';
import Link from 'next/link';
import BuilderSteps from '@/app/[lang]/components/BuilderSteps';
import PageTitleHeading from '@/app/[lang]/components/PageTitleHeading';

/**
 * Compose Transaction page
 */
export default function ComposeTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'compose_txn'));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='compose' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      <p className='mx-4 mb-8 text-sm'>
        <Trans t={t} i18nKey='instructions'>
          asterisk_fields (<span className='text-error'>*</span>) required
        </Trans>
      </p>
      {t('coming_soon')}
    </main>
  );
}
