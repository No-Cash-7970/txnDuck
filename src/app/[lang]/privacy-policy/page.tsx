import { use } from 'react';
import { type Metadata } from 'next';
import { Trans } from 'react-i18next/TransWithoutContext';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { PageTitleHeading } from '@/app/[lang]/components';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['privacy_policy', 'app']);
  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: generateLangAltsMetadata('/txn/privacy-policy'),
  };
}

export default function PrivacyPolicyPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, ['privacy_policy', 'common']));
  return (
    <main className='prose min-h-screen mx-auto pt-4 px-4 pb-12'>
      <PageTitleHeading lng={lang}>{t('title')}</PageTitleHeading>

      <h2>{t('personal_info.title')}</h2>
      <p><Trans t={t} i18nKey='personal_info.details' /></p>

      <h2>{t('app_state_data.title')}</h2>
      <p><Trans t={t} i18nKey='app_state_data.details' /></p>

      <h2>{t('wallet_security.title')}</h2>
      <p>
        <Trans t={t} i18nKey='wallet_security.details'
          components={{
            wc: <a href='https://walletconnect.com/' />,
            pcdocs: <a href='https://docs.perawallet.app/references/pera-connect' />,
            pera: <a href='https://perawallet.app/' />,
            defly:<a href='https://defly.app/' />
          }}
        />
      </p>
    </main>
  );
}
