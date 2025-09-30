import { useState } from 'react';
import { type TFunction } from 'i18next';
import { Atom, useAtom, useAtomValue } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { IconExclamationCircle, IconMinus, IconPlus } from '@tabler/icons-react';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  ADDRESS_LENGTH,
  MAX_APP_ACCTS,
  MAX_APP_TOTAL_DEPS,
  showFormErrorsAtom,
  apatValidateOptions,
} from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import { ValidationMessage, validationAtom } from '@/app/lib/utils';

/** List of application accounts */
export default function AppAccts({ t }: { t: TFunction }) {
  const [appAccts, dispatch] = useAtom(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {appAccts.length > MAX_APP_ACCTS &&
      <div className='alert alert-error text-start' id='apaa-field'>
        <IconExclamationCircle aria-hidden />
        {t('fields.apat.max_error', {count: MAX_APP_ACCTS})}
      </div>
    }
    {!appAccts.length && <p className='italic mt-4 mb-2'>{t('fields.apat.none')}</p>}
    {appAccts.map(
      (acctAtom, i) => <AppAcctInput t={t} acctAtom={acctAtom} index={i} key={`${acctAtom}`} />
    )}
    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: atomWithValidate('', apatValidateOptions)
        })}
        disabled={
          // eslint-disable-next-line @stylistic/max-len
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length) >= MAX_APP_TOTAL_DEPS
          || appAccts.length >= MAX_APP_ACCTS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apat.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={() => dispatch({ type: 'remove', atom: appAccts[appAccts.length - 1] })}
        disabled={!appAccts.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apat.remove_btn')}
      </button>
    </div>
  </>);
}

function AppAcctInput({ t, acctAtom, index }:
  { t: TFunction, acctAtom: Atom<validationAtom<string>>, index: number }
) {
  const [acct, setAcct] = useAtom(useAtomValue(acctAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apat.label', { index: index + 1 })}
      name={`apat-${index}`}
      id={`apat-${index}-input`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apat.placeholder', { index: index + 1 })}
      containerId={`apat-${index}-field`}
      containerClass='mt-6'
      inputClass={((showFormErrors || touched) && !acct.isValid) ? 'input-error': ''}
      maxLength={ADDRESS_LENGTH}
      value={acct.value}
      onChange={(e) => setAcct(e.target.value)}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !acct.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((acct.error as any).message as ValidationMessage).key}
        dict={((acct.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}
