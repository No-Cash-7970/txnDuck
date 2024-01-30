import { useState } from 'react';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Atom, useAtom, useAtomValue } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import {
  MAX_APP_TOTAL_DEPS,
  showFormErrorsAtom,
  apasValidateOptions,
} from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import { ValidationMessage, removeNonNumericalChars, validationAtom } from '@/app/lib/utils';

/** List of application foreign assets */
export default function ForeignAssets({ t }: { t: TFunction }) {
  const [appForeignAssets, dispatch] = useAtom(txnDataAtoms.apas);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {!appForeignAssets.length && <p className='italic'>{t('fields.apas.none')}</p>}

    {appForeignAssets.map(
      (assetAtom, i) => (
        <ForeignAssetInput t={t} assetAtom={assetAtom} index={i} key={`${assetAtom}`} />
      )
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: atomWithValidate(null, apasValidateOptions)
        })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_APP_TOTAL_DEPS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apas.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: appForeignAssets[appForeignAssets.length - 1] })
        }
        disabled={!appForeignAssets.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apas.remove_btn')}
      </button>
    </div>
  </>);
}
function ForeignAssetInput({ t, assetAtom, index }:
  { t: TFunction, assetAtom: Atom<validationAtom<number|null>>, index: number }
) {
  const [asset, setAsset] = useAtom(useAtomValue(assetAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apas.label', { index: index + 1 })}
      name={`apas-${index}`}
      id={`apas-field-${index}`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apas.placeholder', { index: index + 1 })}
      containerId={`apas-${index}-field`}
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || touched) && !asset.isValid) ? 'input-error': ''}
      value={asset.value ?? ''}
      onChange={(e) => {
        const value = removeNonNumericalChars(e.target.value);
        setAsset(value === '' ? null : parseInt(value));
      }}
      onBlur={() => setTouched(true)}
      inputMode='numeric'
    />
    {(showFormErrors || touched) && !asset.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((asset.error as any).message as ValidationMessage).key}
        dict={((asset.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}
