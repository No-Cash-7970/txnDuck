import { NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
  lvConditionalRequireAtom,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function LastValid({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const lvCondReqGroup = useAtomValue(lvConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.lv.label')}
      name='lv'
      id='lv-input'
      tip={{
        content: t('fields.lv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='lv-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.lv) &&
        (form.fieldErrors.lv || (!lvCondReqGroup.isValid && lvCondReqGroup.error)))
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={form.values.lv as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('lv')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('lv')}
      onBlur={form.handleOnBlur('lv')}
    />
    {(showFormErrors || form.touched.lv) && form.fieldErrors.lv &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.lv.message.key}
        dict={form.fieldErrors.lv.message.dict}
      />
    }
    {(showFormErrors || form.touched.lv) && !lvCondReqGroup.isValid
      && lvCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(lvCondReqGroup.error as any).message.key}
        dict={(lvCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
