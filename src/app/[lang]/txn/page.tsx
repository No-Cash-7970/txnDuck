'use client';

import { Trans } from 'react-i18next';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';

export default function TxnTemplatePage({ params: { lang } }: {
  params: { lang: string }
}) {
  const I18N_NS = 'txn_template'; // Namespace for translations
  const { t } = useTranslation(lang, I18N_NS);

  return (
    <main>
      {t('coming_soon')}
    </main>
  );
}
