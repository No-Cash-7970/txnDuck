import { use } from 'react';
import { type Metadata } from 'next';
import { useTranslation } from '@/app/i18n';
import Image from 'next/image';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['app']);
  return {
    title: t('page_title', {page: t('page_not_found.title'), site: t('site_name')}),
    robots: { index: false, follow: false }
  };
}

/** For each supported language, make Next JS generate a static page for the language when building
 * the project.
 * @returns List of languages as parameters
 */
export function generateStaticParams() {
  return [{notFound: ['not-found']}];
}

/** 404 Not Found page */
export default function NotFound({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'app'));

  return (
    <main className='prose min-h-screen mx-auto pt-8 px-4 pb-12 flex flex-col items-center'>
      <div className={'text-center'}>
        <div className='text-primary text-6xl sm:text-8xl font-display font-normal mt-8'>
          {t('page_not_found.quack')}
        </div>
        <div className='h-40 w-40 sm:h-72 sm:w-72 relative not-prose mx-auto mt-10 sm:mt-12'>
          <Image src='/duck.svg' alt={t('page_not_found.duck_img_alt')} fill />
        </div>
      </div>
      <div className='text-4xl sm:text-5xl text-center font-mono mt-[1em]'>
        {t('page_not_found.title')}
      </div>
      <p className='mt-[1.5em] text-lg sm:text-xl'>{t('page_not_found.details')}</p>
    </main>
  );
}
