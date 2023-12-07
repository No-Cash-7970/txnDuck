'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { supportedLangs } from '@/app/i18n/settings';
import { IconLanguage } from '@tabler/icons-react';
import LanguageMenuItem from './LanguageMenuItem';

type Props = {
  /** Language */
  lng?: string
};

/** Language selection button and menu */
export default function LanguageSelector({ lng }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button data-testid='lang-btn'
          className='btn btn-ghost mx-2 px-2 sm:mx-4 sm:px-4 leading-tight'
        >
          <IconLanguage aria-hidden />
          <span className='hidden sm:inline truncate'>{supportedLangs[lng ?? '']?.name ?? ''}</span>
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
              <li key={l} className='mb-1'>
                <LanguageMenuItem page={lng} link={l} />
              </li>
            ))}
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
