import * as Popover from '@radix-ui/react-popover';
import {
  IconAlertSquare,
  IconAlertTriangle,
  IconHelpCircle,
  IconInfoCircle
} from '@tabler/icons-react';
import { useState } from 'react';

export type Props = {
  /** Icon of trigger button */
  btnIcon?: 'info'|'help'|'warning'|'error',
  /** Size of the icon in the button */
  btnIconSize?: number,
  /** Classes to add to the trigger button */
  btnClass?: string,
  /** Value of the `title` attribute of the trigger button.
   * Recommended for making the button more accessible
   */
  btnTitle?: string,
  /** Content of the tooltip. Usually a string of text. */
  content?: any,
  /** Classes to add to the tooltip */
  contentClass?: string,
};

/** Small button within a form field that show a tooltip when clicked */
export default function FieldTip({tipProps}: {tipProps: Props}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open}>
      <Popover.Trigger asChild>
        <a role='button'
          href=''
          title={tipProps?.btnTitle}
          className={'btn btn-ghost btn-sm hover:btn-active'
            + ' p-0 leading-none min-h-0 h-auto align-middle field-tip-btn z-10'
            + (tipProps?.btnClass ? ` ${tipProps.btnClass}` : '')
          }
          onClick={(e) => { e.preventDefault(); setOpen(true); }}
          onBlur={() => setOpen(false)}
        >
          {(!tipProps?.btnIcon || tipProps?.btnIcon === 'info') &&
            <IconInfoCircle aria-hidden size={tipProps?.btnIconSize ?? 22} />
          }
          {tipProps?.btnIcon === 'help' &&
            <IconHelpCircle aria-hidden size={tipProps?.btnIconSize ?? 22} />
          }
          {tipProps?.btnIcon === 'warning' &&
            <IconAlertTriangle aria-hidden size={tipProps?.btnIconSize ?? 22} />
          }
          {tipProps?.btnIcon === 'error' &&
            <IconAlertSquare aria-hidden size={tipProps?.btnIconSize ?? 22} />
          }
        </a>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side='top'
          sideOffset={2}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={tipProps?.contentClass}
        >
          {tipProps?.content}
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
