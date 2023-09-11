'use client';

import { useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import * as Dialog from '@radix-ui/react-dialog';
import { IconSettings, IconX } from '@tabler/icons-react';
import SettingsToast from './SettingsToast';

type Props = {
  /** Language */
  lng?: string,
  /** The open state of the dialog when it is initially rendered */
  open?: boolean,
};

/** Dialog that allows the user to change app settings */
export default function SettingsDialog({ lng, open = false }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  return (
    <>
      <Dialog.Root defaultOpen={open}>
        <Dialog.Trigger asChild>
          <button className='btn btn-ghost px-2' title={t('settings.heading')}>
            <IconSettings stroke={1.5} size={32} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content
            aria-describedby={undefined}
            className='modal data-[state=open]:modal-open'
          >
            <div className='modal-box prose'>
              <Dialog.Title>{t('settings.heading')}</Dialog.Title>
              <div>
                <button
                  className='btn'
                  onClick={() => {setToastOpen(true); setToastMsg(t('settings.saved_message'));}}
                >
                  🦆
                </button>
              </div>
              <div className='action mt-8'>
                <button
                  className='btn btn-sm btn-outline normal-case font-normal'
                  onClick={() => {setToastOpen(true); setToastMsg(t('settings.reset_message'));}}
                >
                  {t('settings.reset_button')}
                </button>
              </div>
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

      <SettingsToast lng={lng} message={toastMsg} open={toastOpen} onOpenChange={setToastOpen} />
    </>
  );
}
