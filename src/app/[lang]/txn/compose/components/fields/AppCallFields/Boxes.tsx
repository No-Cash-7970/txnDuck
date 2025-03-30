import { useState } from 'react';
import { type TFunction } from 'i18next';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import {
  NumberField,
  TextField,
  FieldGroup,
  FieldErrorMessage
} from '@/app/[lang]/components/form';
import {
  MAX_APP_TOTAL_DEPS,
  showFormErrorsAtom,
  apbxIValidateOptions,
  apbxNValidateOptions,
  BoxRefAtomGroup,
  MAX_APP_KEY_LENGTH,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import { ValidationMessage } from '@/app/lib/utils';

/** List of application boxes */
export default function Boxes({ t }: { t: TFunction }) {
  const [boxes, dispatch] = useAtom(txnDataAtoms.apbx);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  return (<>
    {!boxes.length && <p className='italic mt-4 mb-2'>{t('fields.apbx.none')}</p>}
    {boxes.map((boxAtom, i) =>
      <FieldGroup headingLevel={4}
        heading={t('fields.apbx.box_heading', { index: i + 1 })}
        key={`${boxAtom}`}
      >
        <BoxIndexInput t={t} boxAtom={boxAtom} index={i} />
        <BoxNameInput t={t} boxAtom={boxAtom} index={i} />
      </FieldGroup>
    )}
    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: {
            i: atomWithValidate(null, apbxIValidateOptions),
            n: atomWithValidate('', apbxNValidateOptions)
          }
        })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_APP_TOTAL_DEPS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apbx.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={() => dispatch({ type: 'remove', atom: boxes[boxes.length - 1] })}
        disabled={!boxes.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apbx.remove_btn')}
      </button>
    </div>
  </>);
}

function BoxIndexInput({ t, boxAtom, index }:
  { t: TFunction, boxAtom: PrimitiveAtom<BoxRefAtomGroup>, index: number }
) {
  const [boxIndex, setBoxIndex] = useAtom(useAtomValue(boxAtom).i);
  const [touched, setTouched] = useState(false);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.apbx_i.label', { index: index + 1 })}
      name={`apbx_i-${index}`}
      id={`apbx_i-${index}-input`}
      tip={{
        content: t('fields.apbx_i.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId={`apbx_i-${index}-field`}
      containerClass='mt-6 max-w-xs'
      inputClass={((showFormErrors || touched) &&
        (!boxIndex.isValid
          || (boxIndex.value && (boxIndex.value > appForeignApps.length))
        )
      ) ? 'input-error': ''}
      min={0}
      max={appForeignApps.length}
      step={1}
      value={boxIndex.value ?? ''}
      onChange={(e) => {
        setBoxIndex(e.target.value === '' ? null : parseInt(e.target.value));
      }}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !boxIndex.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((boxIndex.error as any).message as ValidationMessage).key}
        dict={((boxIndex.error as any).message as ValidationMessage).dict}
      />
    }
    {(showFormErrors || touched) && !!boxIndex.value && (boxIndex.value > appForeignApps.length) &&
      <FieldErrorMessage t={t}
        i18nkey='fields.apbx_i.max_error'
        dict={{max: appForeignApps.length}}
      />
    }
  </>);
}

function BoxNameInput({ t, boxAtom, index }:
  { t: TFunction, boxAtom: PrimitiveAtom<BoxRefAtomGroup>, index: number }
) {
  const [boxName, setBoxName] = useAtom(useAtomValue(boxAtom).n);
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apbx_n.label', { index: index + 1 })}
      name={`apbx_n-${index}`}
      id={`apbx_n-${index}-input`}
      tip={{
        content: t('fields.apbx_n.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apbx_n.placeholder', { index: index + 1 })}
      containerId={`apbx_n-${index}-field`}
      containerClass='mt-6 max-w-sm'
      inputClass={((showFormErrors || touched) && !boxName.isValid) ? 'input-error': ''}
      maxLength={MAX_APP_KEY_LENGTH}
      value={boxName.value}
      onChange={(e) => setBoxName(e.target.value)}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !boxName.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((boxName.error as any).message as ValidationMessage).key}
        dict={((boxName.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}
