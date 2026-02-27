import { use } from 'react';
import { type Metadata } from 'next';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { IconTrafficCone } from '@tabler/icons-react';

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const params = await props.params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['grp_sign', 'app']);
  const path = '/group/sign';
  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: {
      canonical: `/${params.lang}${path}`,
      languages: generateLangAltsMetadata(path)
    },
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['group_sign']; }

/** Sign Transaction Group page */
export default function GroupSignPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);
  const { t } = use(useTranslation(lang, ['grp_sign', 'app']));
  return (
    <main className='prose max-w-6xl min-h-screen mx-auto pt-8 px-4 pb-12 under'>
      <div className='alert alert-warning'>
        <IconTrafficCone stroke={2} size={32} />
        <p>{t('page_under_construction')}</p>
      </div>
      <BuilderSteps lng={lang} color='secondary' current='sign' />
      <PageTitleHeading lng={lang} showTxnPreset={true}>{t('title')}</PageTitleHeading>
    </main>
  );
}
