import { use } from 'react';
import { type Metadata } from 'next';
import { Trans } from 'react-i18next/TransWithoutContext';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { PageTitleHeading } from '@/app/[lang]/components';
import { IconInfoCircle } from '@tabler/icons-react';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, ['privacy_policy', 'app']);
  const path = '/privacy-policy';

  return {
    title: t('page_title', {page: t('title'), site: t('site_name')}),
    alternates: {
      canonical: `/${params.lang}${path}`,
      languages: generateLangAltsMetadata(path)
    },
  };
}

/** Make Next JS generate at static version of this page */
export function generateStaticParams() { return ['privacy-policy']; }

/** Privacy policy page */
export default function PrivacyPolicyPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, ['privacy_policy', 'common']));
  return (
    <main className='prose min-h-screen mx-auto pt-4 px-4 pb-12'>
      <PageTitleHeading lng={lang}>{t('title')}</PageTitleHeading>

      <h2 id="personal-info">{t('personal_info.heading')}</h2>
      <p>
        <Trans t={t} i18nKey='personal_info.details'
          components={{ magic_section: <a href='#magic-auth' /> }}
        />
      </p>

      <h2 id="app-state-data">{t('app_state_data.heading')}</h2>
      <p><Trans t={t} i18nKey='app_state_data.details' /></p>

      <h2 id="wallet-security">{t('wallet_security.heading')}</h2>
      <p>
        <Trans t={t} i18nKey='wallet_security.details'
          components={{
            wc: <a href='https://walletconnect.com/' target='_blank' />,
            pcdocs: <a href='https://docs.perawallet.app/references/pera-connect'
              target='_blank'
            />,
            pera: <a href='https://perawallet.app/' target='_blank' />,
            defly:<a href='https://defly.app/' target='_blank' />
          }}
        />
      </p>

      <h2 id="magic-auth">{t('magic_auth.heading')}</h2>
      <div className='alert text-start'>
        <IconInfoCircle className='stroke-info' aria-hidden />
        {t('magic_auth.notice')}
      </div>
      <p>
        <Trans t={t} i18nKey='magic_auth.details_1'
          components={{ magic: <a href='https://magic.link/' target='_blank' /> }}
        />
      </p>
      <Trans t={t} i18nKey='magic_auth.details_2' components={{ ul: <ul />, li: <li />, }} />
      <p>
        <Trans t={t} i18nKey='magic_auth.details_3'
          components={{
            magic_privacy: <a href='https://magic.link/legal/privacy-policy' target='_blank' />,
          }}
        />
      </p>
    </main>
  );
}
