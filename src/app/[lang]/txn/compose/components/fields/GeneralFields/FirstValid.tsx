import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import {
  generalFormControlAtom,
  fvLvFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
  fvConditionalRequireAtom,
} from '@/app/lib/txn-data';

export default function FirstValid({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const fvLvGroup = useAtomValue(fvLvFormControlAtom);
  const fvCondReqGroup = useAtomValue(fvConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.fv.label')}
      name='fv'
      id='fv-input'
      tip={{
        content: t('fields.fv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='fv-field'
      containerClass='mt-6 max-w-xs'
      inputClass={(
          (showFormErrors || form.touched.fv) &&
          (form.fieldErrors.fv
            || (!fvLvGroup.isValid && fvLvGroup.error)
            || (!fvCondReqGroup.isValid && fvCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={form.values.fv as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('fv')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('fv')}
      onBlur={form.handleOnBlur('fv')}
    />
    {(showFormErrors || form.touched.fv) && form.fieldErrors.fv &&
      <FieldErrorMessage
        t={t} i18nkey={form.fieldErrors.fv.message.key}
        dict={form.fieldErrors.fv.message.dict}
      />
    }
    {!fvLvGroup.isValid && fvLvGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(fvLvGroup.error as any).message.key}
        dict={(fvLvGroup.error as any).message.dict}
      />
    }
    {(showFormErrors || form.touched.fv) && !fvCondReqGroup.isValid && fvCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(fvCondReqGroup.error as any).message.key}
        dict={(fvCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
