import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import Settings from './Settings';
import { NodeSelector } from './NodeSelector';
import { LanguageSelector } from './LanguageSelector';

type Props = {
  /** Language */
  lng?: string
};

/** Navigation bar that serves as a header for every page */
export default function NavBar({ lng }: Props) {
  const { t } = use(useTranslation(lng || '', ['app', 'common']));

  return (
    <nav className='navbar bg-base-200 px-2 sm:px-4'>
      <div className='navbar-start'>
        <a className='text-2xl font-bold font-display' href={`/${lng}`} title={t('home')}>
            {t('site_name_pt1')}<span className='text-primary'>{t('site_name_pt2')}</span>
        </a>
      </div>
      <div className='navbar-center'>
        <NodeSelector lng={lng} />
      </div>
      <div className='navbar-end'>
        <LanguageSelector lng={lng} />
        <Settings lng={lng} />
      </div>
    </nav>
  );
}
