import { useState } from 'react';
import { TextField, FieldGroup, FieldErrorMessage } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Atom, useAtom, useAtomValue } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { IconExclamationCircle, IconMinus, IconPlus } from '@tabler/icons-react';
import {
  MAX_APP_ARGS,
  apaaValidateOptions,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import { ValidationMessage, validationAtom } from '@/app/lib/utils';

/** List of application arguments */
export default function AppArgs({ t }: { t: TFunction }) {
  const [appArgs, dispatch] = useAtom(txnDataAtoms.apaa);
  return (
    <FieldGroup
      headingLevel={2}
      heading={t('fields.apaa.heading')}
      tip={{
        content: t('fields.apaa.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info_section'),
        contentClass: tipContentClass
      }}
    >
      {appArgs.length > MAX_APP_ARGS &&
        <div className='alert alert-error text-start' id='apaa-field'>
          <IconExclamationCircle aria-hidden />
          {t('fields.apaa.max_error', {count: MAX_APP_ARGS})}
        </div>
      }
      <div className='alert alert-info text-start mt-2'>{t('fields.apaa.no_abi_support')}</div>

      {!appArgs.length && <p className='italic'>{t('fields.apaa.none')}</p>}

      {appArgs.map(
        (argAtom, i) => <AppArgInput t={t} argAtom={argAtom} index={i} key={`${argAtom}`} />
      )}

      <div className='pt-4'>
        <button type='button'
          className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
          onClick={() => dispatch({
            type: 'insert',
            value: atomWithValidate('', apaaValidateOptions)
          })}
          disabled={appArgs.length >= MAX_APP_ARGS}
        >
          <IconPlus aria-hidden />
          {t('fields.apaa.add_btn')}
        </button>
        <button type='button'
          className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
          onClick={() => dispatch({ type: 'remove', atom: appArgs[appArgs.length - 1] })}
          disabled={!appArgs.length}
        >
          <IconMinus aria-hidden />
          {t('fields.apaa.remove_btn')}
        </button>
      </div>
    </FieldGroup>
  );
}
function AppArgInput({ t, argAtom, index }:
  { t: TFunction, argAtom: Atom<validationAtom<string>>, index: number }
) {
  const [arg, setArg] = useAtom(useAtomValue(argAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apaa.label', { index: index + 1 })}
      name={`apaa-${index}`}
      id={`apaa-${index}-input`}
      inputInsideLabel={false}
      placeholder={t('fields.apaa.placeholder', { index: index + 1 })}
      containerId={`apaa-${index}-field`}
      containerClass='mt-4 max-w-md'
      inputClass={((showFormErrors || touched) && !arg.isValid) ? 'input-error': ''}
      value={arg.value}
      onChange={(e) => setArg(e.target.value)}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !arg.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((arg.error as any).message as ValidationMessage).key}
        dict={((arg.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}
