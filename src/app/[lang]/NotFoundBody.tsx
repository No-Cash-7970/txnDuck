'use client';

import { useTranslation } from '../i18n/client';
import Image from 'next/image';

export default function NotFoundBody() {
  // Attempt to get the current language stored in localStorage because the Not-Found page cannot
  // use the "lang" path parameter. We also cannot get the value from the cookie because that would
  // ruin the ability of this app to be statically exported. This leaves us with getting the current
  // language from localStorage on the client side as our only option.
  const { t } = useTranslation('', 'app');
  return (<>
    <div className={'text-center'}>
      <div className='text-primary text-6xl sm:text-8xl font-display font-normal mt-8'>
        {t('page_not_found.quack')}
      </div>
      <div className='h-40 w-40 sm:h-72 sm:w-72 relative not-prose mx-auto mt-10 sm:mt-12'>
        <Image src='/assets/duck.svg' alt={t('page_not_found.duck_img_alt')} fill />
      </div>
    </div>
    <div className='text-4xl sm:text-5xl text-center font-mono mt-[1em]'>
      {t('page_not_found.title')}
    </div>
    <p className='mt-[1.5em] text-lg sm:text-xl'>{t('page_not_found.details')}</p>
  </>);
}
