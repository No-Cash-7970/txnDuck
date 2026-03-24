import { use } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n';

type Props = {
  /** Language */
  lng: string,
  /** Name of the current step */
  current?: 'compose' | 'sign' | 'send' | 'done',
  /** Color of current and completed steps */
  color?: 'primary' | 'secondary' | 'accent',
  /** If building a transaction group */
  group?: boolean,
};

/** Roadmap display for showing the steps of building a transaction or a transaction group */
export default function BuilderSteps({ lng, current, color = 'primary', group = false }: Props) {
  const { t } = use(useTranslation(lng || '', 'app'));

  return (
    <ul className='steps w-full my-4 p-0'>
      <li className={'step'
        + (current === 'compose' ? ` font-bold step-${color} text-${color}` : '')
        + (current === 'sign' ? ` step-${color}` : '')
        + (current === 'send' ? ` step-${color}` : '')
      }>
        {current === 'compose' && t('builder_steps.compose')}
        {current !== 'compose' &&
          <Link href={group ? `/${lng}/group/compose` : `/${lng}/txn/compose`} className='text-sm'>
            {t('builder_steps.compose')}
          </Link>
        }
      </li>
      <li className={'step'
        + (current === 'sign' ? ` font-bold step-${color} text-${color}` : '')
        + (current === 'send' ? ` step-${color}` : '')
      }>
        {current === 'sign' && t('builder_steps.sign')}
        {current !== 'sign' &&
          <Link href={group ? `/${lng}/group/sign` : `/${lng}/txn/sign`} className='text-sm'>
            {t('builder_steps.sign')}
          </Link>
        }
      </li>
      <li className={'step' + (current === 'send' ? ` font-bold step-${color} text-${color}` : '')}>
        {current === 'send' && t('builder_steps.send')}
        {current !== 'send' &&
          <Link href={group ? `/${lng}/group/send` : `/${lng}/txn/send`} className='text-sm'>
            {t('builder_steps.send')}
          </Link>
        }
      </li>
    </ul>
  );
}
