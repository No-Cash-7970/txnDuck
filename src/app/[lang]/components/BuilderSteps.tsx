import { use } from 'react';
import { useTranslation } from '@/app/i18n';

type Props = {
  /** Language */
  lng?: string,
  /** Name of the current step */
  current?: 'compose' | 'sign' | 'send' | 'done',
  /** Color of current and completed steps */
  color?: 'primary' | 'secondary' | 'accent',
};

/**
 * Roadmap display for showing the steps of building a transaction
 */
export default function BuilderSteps({ lng, current, color = 'primary'}: Props) {
  const { t } = use(useTranslation(lng || '', 'app'));

  return (
    <ul className='steps w-full my-4 p-0'>
      <li
        className={
          'step'
          + (current == 'compose'? ` step-${color}` : '')
          + (current == 'sign'? ` step-${color} text-${color}` : '')
          + (current == 'send'? ` step-${color} text-${color}` : '')
          + (current == 'done'? ` step-${color} text-${color}` : '')
        }
      >
        {t('builder_steps.compose')}
      </li>
      <li
        className={
          'step'
          + (current == 'sign'? ` step-${color}` : '')
          + (current == 'send'? ` step-${color} text-${color}` : '')
          + (current == 'done'? ` step-${color} text-${color}` : '')
        }
      >
        {t('builder_steps.sign')}
      </li>
      <li
        data-content={current == 'done'? '★': null}
        className={
          'step'
          + (current == 'send'? ` step-${color}` : '')
          + (current == 'done'? ` step-${color} text-${color}` : '')
        }
      >
        {t('builder_steps.send')}
      </li>
    </ul>
  );
}
