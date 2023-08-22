'use client';

import { Trans } from 'react-i18next';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';
import BuilderSteps from '@/app/[lang]/components/BuilderSteps';

export default function ComposeTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const I18N_NS = 'compose_txn'; // Namespace for translations
  const { t } = useTranslation(lang, I18N_NS);

  return (
    <main>
      <BuilderSteps lng={lang} current='compose' />
      {t('coming_soon')}
    </main>
  );
}
