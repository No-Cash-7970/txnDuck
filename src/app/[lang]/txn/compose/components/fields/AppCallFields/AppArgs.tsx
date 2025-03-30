import { useState } from 'react';
import {
  TextField,
  FieldGroup,
  FieldErrorMessage,
  CheckboxField
} from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Atom, useAtom, useAtomValue } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { IconExclamationCircle, IconMinus, IconPlus } from '@tabler/icons-react';
import {
  MAX_APP_ARGS,
  apaaValidateOptions,
  applFormControlAtom,
  createb64ApaaCondValidateAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import { ValidationMessage, validationAtom } from '@/app/lib/utils';

/** List of application arguments */
export default function AppArgs({ t }: { t: TFunction }) {
  const [appArgs, apaaDispatch] = useAtom(txnDataAtoms.apaa);
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

      <Base64ApaaInput t={t} />

      {!appArgs.length && <p className='italic mt-8 mb-2'>{t('fields.apaa.none')}</p>}
      {appArgs.map(
        (argAtom, i) => <AppArgInput t={t} argAtom={argAtom} index={i} key={`${argAtom}`} />
      )}
      <div className='pt-4'>
        <button type='button'
          className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
          onClick={() => {
            const newAtom = atomWithValidate('', apaaValidateOptions);
            // Add atom for new atom
            apaaDispatch({ type: 'insert', value: newAtom });
            // Add conditional validation for new atom
            txnDataAtoms.b64ApaaCondList.push(createb64ApaaCondValidateAtom(newAtom));
          }}
          disabled={appArgs.length >= MAX_APP_ARGS}
        >
          <IconPlus aria-hidden />
          {t('fields.apaa.add_btn')}
        </button>
        <button type='button'
          className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
          onClick={() => {
            // Remove last atom
            apaaDispatch({ type: 'remove', atom: appArgs[appArgs.length - 1] });
            // Remove conditional validation for last atom
            txnDataAtoms.b64ApaaCondList.pop();
          }}
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
  const condB64 = useAtomValue(txnDataAtoms.b64ApaaCondList[index]);
  return (<>
    <TextField label={t('fields.apaa.label', { index: index + 1 })}
      name={`apaa-${index}`}
      id={`apaa-${index}-input`}
      inputInsideLabel={false}
      placeholder={t('fields.apaa.placeholder', { index: index + 1 })}
      containerId={`apaa-${index}-field`}
      containerClass='mt-6 max-w-md'
      inputClass={
        ((showFormErrors || touched) && (!arg.isValid || (!condB64.isValid && condB64.error)))
        ? 'input-error' : ''
      }
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
    {(showFormErrors || touched) && !condB64.isValid && condB64.error &&
      <FieldErrorMessage t={t} i18nkey={(condB64.error as any).message.key} />
    }
  </>);
}

export function Base64ApaaInput({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  return (
    <CheckboxField label={t('fields.b64_apaa.label')}
      name='b64_apaa'
      id='b64Apaa-input'
      tip={{
        content: t('fields.b64_apaa.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='b64Apaa-field'
      containerClass='mt-6'
      inputClass='checkbox-primary checkbox me-2'
      labelClass='justify-start w-fit max-w-full align-middle'
      value={!!form.values.b64Apaa}
      onChange={(e) => form.handleOnChange('b64Apaa')(e.target.checked)}
    />
  );
}
