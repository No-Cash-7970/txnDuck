'use client';

import '/node_modules/flag-icons/css/flag-icons.css';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { supportedLangs } from '@/app/i18n/settings';
import { IconLanguage } from '@tabler/icons-react';

type Props = {
  /** Language */
  lng?: string
};

/** Language selection button and menu */
export default function LanguageSelector({ lng }: Props) {
  const currentURLPath = usePathname();
  const currentURLParams = useSearchParams();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className='btn btn-ghost mx-2 px-2 sm:mx-4 sm:px-4' data-testid='lang-btn'>
          <IconLanguage aria-hidden />
          <span className='hidden sm:inline truncate'>{lng ? supportedLangs[lng].name : ''}</span>
          <span className='sm:hidden truncate'>{lng?.toUpperCase()}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild>
          <ul className={'z-[1000] card menu shadow-md border border-base-300 bg-base-200'
            + ' data-[side=bottom]:mt-1 data-[side=top]:mb-1'
            + ' data-[side=left]:mr-1 data-[side=right]:ml-1'
          }>
            {Object.keys(supportedLangs).map((l: string) => (
              <li key={l}>
                <Link
                  className={l === lng ? 'active': ''}
                  href={{
                    pathname: `/${l}` + currentURLPath.replace(`/${lng}`, ''),
                    query: currentURLParams.toString()
                  }}
                  replace={true}
                  scroll={false}
                >
                  <span
                    className={`mask mask-circle h-5 w-5 fis fi-${supportedLangs[l].country}`}
                  ></span>
                  {supportedLangs[l].listName}
                </Link>
              </li>
            ))}
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
