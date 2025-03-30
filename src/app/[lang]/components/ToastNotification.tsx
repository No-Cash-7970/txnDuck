import { dir } from 'i18next';
import * as Toast from '@radix-ui/react-toast';
import { IconSettingsCheck, IconX } from '@tabler/icons-react';
import { useTranslation } from '@/app/i18n/client';

interface Props {
  /** Language */
  lng?: string;
  /** Message the toast notification should contain */
  message?: string;
  /** The controlled open state of the toast notification. Must be used in conjunction with
   * `onOpenChange`.
   */
  open?: boolean;
  /** Event handler called when the open state of the dialog changes. */
  onOpenChange?(open: boolean): void
};

/** Toast (notification) for when a setting or multiple settings are updated and saved */
export default function ToastNotification({ lng, message, open, onOpenChange }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);
  const langDir = dir(lng);
  return (
    <Toast.Root
      type='foreground'
      className={'alert alert-success text-sm py-2 text-start'
        + ' ' + (langDir === 'rtl'
          ? 'data-[state=open]:animate-toastSlideInFromLeft'
          : 'data-[state=open]:animate-toastSlideInFromRight'
        )
        + ' data-[state=closed]:animate-toastHide'
        + ' data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)'
        + ' data-[swipe=cancel]:translate-x-0'
        + ' data-[swipe=cancel]:transition-[transform_200ms_ease-out]'
        + ' ' + (langDir === 'rtl'
          ? 'data-[swipe=end]:animate-toastSwipeOutToLeft'
          : 'data-[swipe=end]:animate-toastSwipeOutToRight'
        )}
      open={open}
      onOpenChange={onOpenChange}
    >
      <IconSettingsCheck aria-hidden stroke={1.5} size={22} />
      <Toast.Description>{message}</Toast.Description>
      <Toast.Close asChild>
        <button
          className='btn btn-outline btn-square btn-sm text-success-content sm:btn-ghost'
          aria-label={t('close')}
        >
          <IconX aria-hidden size={20} />
        </button>
      </Toast.Close>
    </Toast.Root>
  );
}
