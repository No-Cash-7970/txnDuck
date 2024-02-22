import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  paymentFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import { nodeConfigAtom } from '@/app/lib/node-config';

export default function Amount({ t }: { t: TFunction }) {
  const form = useAtomValue(paymentFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  return (<>
    <NumberField label={t('fields.amt.label')}
      name='amt'
      id='amt-input'
      tip={{
        content: t('fields.amt.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='amt-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.amt) && form.fieldErrors.amt) ? 'input-error' : ''
      }
      afterSideLabel={nodeConfig.coinName || t('algo', {count: form.values.amt as number ?? 0})}
      min={0}
      step={0.000001}
      value={form.values.amt as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('amt')(e.target.value === '' ? undefined : parseFloat(e.target.value))
      }
      onFocus={form.handleOnFocus('amt')}
      onBlur={form.handleOnBlur('amt')}
    />
    {(showFormErrors || form.touched.amt) && form.fieldErrors.amt &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.amt.message.key}
        dict={form.fieldErrors.amt.message.dict}
      />
    }
  </>);
}
