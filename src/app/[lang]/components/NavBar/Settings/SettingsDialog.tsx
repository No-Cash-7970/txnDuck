'use client';

import { useTranslation } from '@/app/i18n/client';
import * as Dialog from '@radix-ui/react-dialog';
import { IconSettings, IconX } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { DialogLoadingPlaceholder } from '@/app/[lang]/components';

const SettingsModalBox = dynamic(() => import('./SettingsForm'), {
  ssr: false,
  loading: () => <DialogLoadingPlaceholder />,
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
        <button type='button' className='btn btn-ghost px-2' title={t('settings.heading')}>
          <IconSettings stroke={1.5} size={32} aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          className='modal modal-open'
          aria-describedby={undefined}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className='modal-box prose px-0 max-w-xl'>
            <Dialog.Title className='px-6 sm:px-8'>{t('settings.heading')}</Dialog.Title>
            {/* Max height = height of modal (100vh - 5em)
                            - modal title height (2em)
                            - modal title bottom margin (1.5em)
                            - modal box top padding (1.5em)
                            - modal box bottom padding (1.5em)
            */}
            <div
              className='max-h-[calc(100vh-5em-2em-1.5em-1.5em-1.5em)] overflow-auto px-6 sm:px-8'
            >
              <SettingsModalBox lng={lng} />
            </div>

            <Dialog.Close asChild>
              <button type='button'
                className='btn-ghost btn btn-sm btn-square text-base-content fixed inset-e-3 top-3'
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
