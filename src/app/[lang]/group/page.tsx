import { Suspense, use } from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import {
  IconArrowBigRightLinesFilled,
  IconArrowBigLeftLinesFilled,
  IconTrafficCone
} from '@tabler/icons-react';
import { PageLoadingPlaceholder, PageTitleHeading } from '@/app/[lang]/components';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['grp_presets', 'app']);
  const path = '/group';
  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: {
      canonical: `/${params.lang}${path}`,
      languages: generateLangAltsMetadata(path)
    },
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['group']; }

/** Choose Transaction Group Presets page */
export default function GroupPresetsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);
  const { t } = use(useTranslation(lang, ['grp_presets', 'app']));
  return (
    <main className='prose max-w-6xl min-h-screen mx-auto pt-8 px-4 pb-12'>
      <div className='alert alert-warning'>
        <IconTrafficCone stroke={2} size={32} />
        <p>{t('page_under_construction')}</p>
      </div>
      <PageTitleHeading>{t('title')}</PageTitleHeading>
      <p className='text-center text-lg mb-3'>{t('instruction')}</p>
      <div className='flex justify-center'>
        <Link
          href={`/${lang}/txn/compose`}
          className={'btn btn-block btn-accent font-normal'
            + ' text-lg py-1 max-w-3xl flex-wrap'
          }
        >
          <IconArrowBigRightLinesFilled aria-hidden className='rtl:hidden' />
          <IconArrowBigLeftLinesFilled aria-hidden className='hidden rtl:block' />
          {t('skip_btn')}
        </Link>
      </div>
    </main>
  );
}
