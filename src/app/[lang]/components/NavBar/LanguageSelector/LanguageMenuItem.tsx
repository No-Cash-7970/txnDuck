'use client';

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
      <li className='mb-1 max-w-full'>
        <a className={link === page ? 'active': ''}
          href={(`/${link}` + currentURLPath.replace(`/${page}`, ''))
            + (currentURLParams.size ? `?${currentURLParams.toString()}`: '')
          }
        >
          {supportedLangs[link].listName}
        </a>
      </li>
    </DropdownMenu.Item>
  );
}
