'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { supportedLangs } from '@/app/i18n/settings';

type Props = {
  /** Language of the page */
  page?: string
  /** Language the link is for */
  link?: string
};

/** Item (language) in the language menu */
export default function LanguageMenuItem({ page='', link='' }: Props) {
  const currentURLPath = usePathname();
  const currentURLParams = useSearchParams();
  return (
    <DropdownMenu.Item asChild>
      <Link
        className={link === page ? 'active': ''}
        href={{
          pathname: `/${link}` + currentURLPath.replace(`/${page}`, ''),
          query: currentURLParams.toString()
        }}
        replace={true}
        scroll={false}
        prefetch={false}
      >
        {supportedLangs[link].listName}
      </Link>
    </DropdownMenu.Item>
  );
}
