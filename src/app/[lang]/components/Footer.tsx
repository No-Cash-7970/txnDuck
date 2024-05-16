import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import { IconBrandGithubFilled, IconLockSquare } from '@tabler/icons-react';
import Link from 'next/link';
import { Trans } from 'react-i18next/TransWithoutContext';

type Props = {
  /** Language */
  lng?: string
};

/** Footer for every page */
export default function Footer({ lng }: Props) {
  const { t } = use(useTranslation(lng || '', 'app'));
  return (
    <footer className='footer item-center bg-neutral text-neutral-content px-8 py-10 sm:px-12'>
      <div className='w-full max-w-6xl mx-auto place-items-center'>
        {/* Links */}
        <div className='grid sm:grid-flow-col sm:gap-6 gap-4'>
          <Link href={`/${lng}/privacy-policy`}
            className='link link-hover flex gap-1'
            prefetch={false}
          >
            <IconLockSquare size={22} aria-hidden />
            <span>{t('footer.privacy_policy_link')}</span>
          </Link>
          <a href='https://github.com/No-Cash-7970/txnDuck'
            target='_blank'
            className='link link-hover flex gap-1'
          >
            <IconBrandGithubFilled size={20} aria-hidden />
            <span>{t('footer.github_link')}</span>
          </a>
          <a href='https://developer.algorand.org/docs/'
            target='_blank'
            className='link link-hover flex gap-1'
          >
            {/* eslint-disable-next-line max-len */}
            <svg aria-hidden className='fill-neutral-content stroke-none me-[2px] mt-[2px]' height={17} width={17} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              {/* eslint-disable-next-line max-len */}
              <path d="M32 32H27.0095L23.7387 19.9201L16.725 32H11.1275L21.9515 13.2913L20.1981 6.76341L5.59747 32H0L18.5121 0H23.4352L25.5595 7.97476H30.6175L27.1781 13.9642L32 32Z"></path>
            </svg>
            <span>{t('footer.algo_docs_link')}</span>
          </a>
        </div>
        {/* License notice */}
        <p className='text-sm mt-4'>
          <Trans t={t} i18nKey='footer.license_notice' components={
            {a: <a href='https://github.com/No-Cash-7970/txnDuck/blob/main/LICENSE.md'
              target='_blank'
              className='underline'
            />}
          } />
        </p>
      </div>
    </footer>
  );
}
