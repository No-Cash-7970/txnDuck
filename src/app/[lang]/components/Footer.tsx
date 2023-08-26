import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { Trans } from 'react-i18next/TransWithoutContext';

type Props = {
  /** Language */
  lng?: string
};

/**
 * Footer for every page
 */
export default function Footer({ lng }: Props) {
  const { t } = use(useTranslation(lng || '', 'app'));

  return (
    <footer className='footer item-center bg-neutral text-neutral-content p-10'>
      <div className='w-full max-w-6xl mx-auto place-items-center'>
        {/* Links */}
        <div className='grid grid-flow-col gap-6'>
          {/* <Link href='' className='link link-hover'>Privacy Policy</Link> */}
          <Link
            href='https://github.com/No-Cash-7970/txnDuck'
            className='link link-hover flex gap-1'
          >
            <IconBrandGithubFilled size={20}/>
            <span>{t('footer.github_link')}</span>
          </Link>
        </div>

        {/* License notice */}
        <p className='prose max-w-none text-neutral-content text-sm prose-a:text-primary mt-4'>
          <Trans t={t} i18nKey='footer.license_notice'>
            using_is_agreeing_to
            <Link href='https://github.com/No-Cash-7970/txnDuck/blob/main/LICENSE.md'>
              license
            </Link>.
          </Trans>
        </p>
      </div>
    </footer>
  );
}
