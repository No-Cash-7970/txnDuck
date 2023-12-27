import { NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  aamtConditionalMaxAtom,
  assetTransferFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
  txnDataAtoms,
} from '@/app/lib/txn-data';
import { baseUnitsToDecimal } from '@/app/lib/utils';
import FieldErrorMessage from '../FieldErrorMessage';

export default function Amount({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const aamtCondMax = useAtomValue(aamtConditionalMaxAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const retrievedAssetInfo = useAtomValue(txnDataAtoms.retrievedAssetInfo);
  return (<>
    <NumberField label={t('fields.aamt.label')}
      name='aamt'
      id='aamt-input'
      tip={{
        content: t('fields.aamt.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='aamt-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.aamt) &&
          (form.fieldErrors.aamt || (!aamtCondMax.isValid && aamtCondMax.error))
        )
        ? 'input-error' : ''
      }
      afterSideLabel={retrievedAssetInfo?.value?.unitName ?? t('unit_other')}
      min={0}
      max={
        baseUnitsToDecimal(retrievedAssetInfo?.value?.total, retrievedAssetInfo?.value?.decimals)
      }
      step={10**-(retrievedAssetInfo?.value?.decimals ?? 0)}
      value={form.values.aamt ?? ''}
      onChange={(e) => form.handleOnChange('aamt')(e.target.value)}
      onFocus={form.handleOnFocus('aamt')}
      onBlur={form.handleOnBlur('aamt')}
    />
    {(showFormErrors || form.touched.aamt) && form.fieldErrors.aamt &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.aamt.message.key}
        dict={form.fieldErrors.aamt.message.dict}
      />
    }
    {(showFormErrors || form.touched.aamt) && !aamtCondMax.isValid && aamtCondMax.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aamtCondMax.error as any).message.key}
        dict={(aamtCondMax.error as any).message.dict}
      />
    }
  </>);
}
