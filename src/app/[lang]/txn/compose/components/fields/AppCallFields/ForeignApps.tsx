import { useState } from 'react';
import { type TFunction } from 'i18next';
import { Atom, useAtom, useAtomValue } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import { MAX_APP_TOTAL_DEPS, showFormErrorsAtom, apfaValidateOptions } from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import { ValidationMessage, removeNonNumericalChars, validationAtom } from '@/app/lib/utils';

/** List of application foreign apps */
export default function ForeignApps({ t }: { t: TFunction }) {
  const [appForeignApps, dispatch] = useAtom(txnDataAtoms.apfa);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {!appForeignApps.length && <p className='italic mt-4 mb-2'>{t('fields.apfa.none')}</p>}
    {appForeignApps.map(
      (appAtom, i) => <ForeignAppInput t={t} appAtom={appAtom} index={i} key={`${appAtom}`} />
    )}
    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: atomWithValidate(null, apfaValidateOptions)
        })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_APP_TOTAL_DEPS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apfa.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: appForeignApps[appForeignApps.length - 1] })
        }
        disabled={!appForeignApps.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apfa.remove_btn')}
      </button>
    </div>
  </>);
}

function ForeignAppInput({ t, appAtom, index }:
  { t: TFunction, appAtom: Atom<validationAtom<number|null>>, index: number }
) {
  const [app, setApp] = useAtom(useAtomValue(appAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apfa.label', { index: index + 1 })}
      name={`apfa-${index}`}
      id={`apfa-${index}-input`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apfa.placeholder', { index: index + 1 })}
      containerId={`apfa-${index}-field`}
      containerClass='mt-6 max-w-xs'
      inputClass={((showFormErrors || touched) && !app.isValid) ? 'input-error': ''}
      value={app.value ?? ''}
      onChange={(e) => {
        const value = removeNonNumericalChars(e.target.value);
        setApp(value === '' ? null : parseInt(value));
      }}
      onBlur={() => setTouched(true)}
      inputMode='numeric'
    />
    {(showFormErrors || touched) && !app.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((app.error as any).message as ValidationMessage).key}
        dict={((app.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}
