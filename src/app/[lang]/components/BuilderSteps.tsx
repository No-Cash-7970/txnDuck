import { use } from 'react';
import { useTranslation } from '@/app/i18n';
import Link from 'next/link';

type Props = {
  /** Language */
  lng?: string,
  /** Name of the current step */
  current?: 'compose' | 'sign' | 'send' | 'done',
  /** Color of current and completed steps */
  color?: 'primary' | 'secondary' | 'accent',
};

/** Roadmap display for showing the steps of building a transaction */
export default function BuilderSteps({ lng, current, color = 'primary'}: Props) {
  const { t } = use(useTranslation(lng || '', 'app'));

  return (
    <ul className='steps w-full my-4 p-0'>
      <li className={'step'
        + (current === 'compose' ? ` font-bold step-${color}` : '')
        + (current === 'sign' ? ` step-${color}` : '')
        + (current === 'send' ? ` step-${color}` : '')
      }>
        {current === 'compose'
          ? t('builder_steps.compose')
          : <Link href={`/${lng}/txn/compose`} className='not-prose'>
            {t('builder_steps.compose')}
          </Link>
        }
      </li>
      <li className={'step'
        + (current === 'sign' ? ` font-bold step-${color}` : '')
        + (current === 'send' ? ` step-${color}` : '')
      }>
        {current === 'sign'
          ? t('builder_steps.sign')
          : <Link href={`/${lng}/txn/sign`} className='not-prose'>
            {t('builder_steps.sign')}
          </Link>
        }
      </li>
      <li className={'step' + (current === 'send' ? ` font-bold step-${color}` : '')}>
        {current === 'send'
          ? t('builder_steps.send')
          : <Link href={`/${lng}/txn/send`} className='not-prose'>
            {t('builder_steps.send')}
          </Link>
        }
      </li>
    </ul>
  );
}
