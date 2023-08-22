'use client';

import { Trans } from 'react-i18next';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import BuilderSteps from '@/app/[lang]/components/BuilderSteps';
import PageTitleHeading from '@/app/[lang]/components/PageTitleHeading';

/**
 * Compose Transaction page
 */
export default function ComposeTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const I18N_NS = 'compose_txn'; // Namespace for translations
  const { t } = useTranslation(lang, I18N_NS);

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='compose' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      <p className='mx-4 mb-8 text-sm'>
        <Trans i18nKey='instructions' ns={I18N_NS}>
          asterisk_fields (<span className='text-error'>*</span>) required
        </Trans>
      </p>
      {t('coming_soon')}
    </main>
  );
}
