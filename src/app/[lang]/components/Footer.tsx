import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import { IconBrandGithubFilled } from '@tabler/icons-react';
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
        <div className='grid grid-flow-col gap-6'>
          <Link href={`/${lng}/privacy-policy`} className='link link-hover' prefetch={false}>
            {t('footer.privacy_policy_link')}
          </Link>
          <a href='https://github.com/No-Cash-7970/txnDuck' className='link link-hover flex gap-1'>
            <IconBrandGithubFilled size={20} aria-hidden />
            <span>{t('footer.github_link')}</span>
          </a>
        </div>
        {/* License notice */}
        <p className='text-sm mt-4'>
          <Trans t={t} i18nKey='footer.license_notice' components={
            {a: <a href='https://github.com/No-Cash-7970/txnDuck/blob/main/LICENSE.md'
              className='underline'
            />}
          } />
        </p>
      </div>
    </footer>
  );
}
