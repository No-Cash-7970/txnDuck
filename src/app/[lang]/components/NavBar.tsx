'use client';

import { useTranslation } from '@/app/i18n/client';
import React from 'react';
import { Trans } from 'react-i18next';

type Props = {
  lng?: string
};

export default function NavBar({ lng }: Props) {
  const { t, i18n } = useTranslation(lng || '', 'app');

  return (
    <nav className='navbar bg-base-200 px-2 sm:px-4'>
      <a className='text-2xl font-bold font-display' href={`/${lng}`} title={t('home')}>
        <Trans i18n={i18n} i18nKey="site_name_formatted" ns='app'>
          name_pt_1<span className='text-primary'>name_pt_2</span>
        </Trans>
      </a>
    </nav>
  );
}
