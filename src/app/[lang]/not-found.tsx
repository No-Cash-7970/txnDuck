'use client';

import { type Metadata } from 'next';
import { useTranslation } from '@/app/i18n';
import NotFoundBody from './NotFoundBody';

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

/** 404 Not Found page */
export default function NotFound() {
  return (
    <main className='prose min-h-screen mx-auto pt-8 px-4 pb-12 flex flex-col items-center'>
      <NotFoundBody />
    </main>
  );
}
