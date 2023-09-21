import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import { Trans } from 'react-i18next/TransWithoutContext';
import Settings from './Settings';

type Props = {
  /** Language */
  lng?: string
};

/**
 * Navigation bar that serves as a header for every page
 */
export default function NavBar({ lng }: Props) {
  const { t } = use(useTranslation(lng || '', 'app'));

  return (
    <nav className='navbar bg-base-200 px-2 sm:px-4'>
      <div className='navbar-start'>
        <a className='text-2xl font-bold font-display' href={`/${lng}`} title={t('home')}>
          <Trans t={t} i18nKey='site_name_formatted'>
            name_pt_1<span className='text-primary'>name_pt_2</span>
          </Trans>
        </a>
      </div>
      <div className='navbar-center'>

      </div>
      <div className='navbar-end'>
        <Settings />
      </div>
    </nav>
  );
}
