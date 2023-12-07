'use client';

import { useTranslation } from '@/app/i18n/client';
import * as Dialog from '@radix-ui/react-dialog';
import { IconSettings, IconX } from '@tabler/icons-react';
import dynamic from 'next/dynamic';

const SettingsModalBox = dynamic(() => import('./SettingsForm'), {
  ssr: false,
  loading: () => (
    <p className='text-center'>
      <span className='loading loading-ball loading-lg text-primary'></span>
      <span className='loading loading-ball loading-lg text-secondary'></span>
      <span className='loading loading-ball loading-lg text-accent'></span>
    </p>
  ),
});

type Props = {
  /** Language */
  lng?: string,
  /** The open state of the dialog when it is initially rendered */
  open?: boolean,
};

/** Dialog that allows the user to change app settings */
export default function SettingsDialog({ lng, open = false }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);

  return (<>
    <Dialog.Root defaultOpen={open} modal={false}>
      <Dialog.Trigger asChild>
        <button className='btn btn-ghost px-2' title={t('settings.heading')}>
          <IconSettings stroke={1.5} size={32} aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          className='modal data-[state=open]:modal-open'
          aria-describedby={undefined}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className='modal-box prose'>
            <Dialog.Title>{t('settings.heading')}</Dialog.Title>
            <SettingsModalBox lng={lng} />
            <Dialog.Close asChild>
              <button
                className='btn-ghost btn btn-sm btn-square text-base-content absolute end-3 top-3'
                title={t('close')}
              >
                <IconX aria-hidden />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>);
}
