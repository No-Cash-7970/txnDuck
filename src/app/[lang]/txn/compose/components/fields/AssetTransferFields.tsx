/** Fields for the compose-transaction form that are for asset-transfer transaction */

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NumberField, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  Preset,
  acloseConditionalRequireAtom,
  asndConditionalRequireAtom,
  assetTransferFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import { IconAlertTriangle } from '@tabler/icons-react';
import FieldErrorMessage from './FieldErrorMessage';

export function Sender({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const asndCondReqGroup = useAtomValue(asndConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.asnd.label')}
      name='asnd'
      id='asnd-input'
      tip={{
        content: t('fields.asnd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.AssetClawback}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.asnd.placeholder')}
      containerId='asnd-field'
      containerClass='mt-4'
      inputClass={((showFormErrors || form.touched.asnd) &&
          (form.fieldErrors.asnd || (!asndCondReqGroup.isValid && asndCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.asnd as string}
      onChange={(e) => form.handleOnChange('asnd')(e.target.value)}
      onFocus={form.handleOnFocus('asnd')}
      onBlur={form.handleOnBlur('asnd')}
    />
    {(showFormErrors || form.touched.asnd) && form.fieldErrors.asnd &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.asnd.message.key}
        dict={form.fieldErrors.asnd.message.dict}
      />
    }
    {(showFormErrors || form.touched.asnd) && !asndCondReqGroup.isValid && asndCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(asndCondReqGroup.error as any).message.key}
        dict={(asndCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function Receiver({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.arcv.label')}
      name='arcv'
      id='arcv-input'
      tip={{
        content: t('fields.arcv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.arcv.placeholder')}
      containerId='arcv-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.arcv) && form.fieldErrors.arcv) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.arcv as string}
      onChange={(e) => form.handleOnChange('arcv')(e.target.value)}
      onFocus={form.handleOnFocus('arcv')}
      onBlur={form.handleOnBlur('arcv')}
    />
    {(showFormErrors || form.touched.arcv) && form.fieldErrors.arcv &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.arcv.message.key}
        dict={form.fieldErrors.arcv.message.dict}
      />
    }
  </>);
}

export function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.xaid.label')}
      name='xaid'
      id='xaid-input'
      tip={{
        content: t('fields.xaid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='xaid-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.xaid) && form.fieldErrors.xaid) ? 'input-error' : ''
      }
      value={form.values.xaid as number ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        form.handleOnChange('xaid')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('xaid')}
      onBlur={form.handleOnBlur('xaid')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.xaid) && form.fieldErrors.xaid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.xaid.message.key}
        dict={form.fieldErrors.xaid.message.dict}
      />
    }
  </>);
}

export function Amount({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
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
      inputClass={
        ((showFormErrors || form.touched.aamt) && form.fieldErrors.aamt) ? 'input-error' : ''
      }
      afterSideLabel={t('algo_other')}
      min={0}
      step={0.000001}
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
  </>);
}

/** The "Close To" field WITH the notice */
export function CloseTo({ t }: { t: TFunction }) {
  return (
    <>
      <CloseToInput t={t} />

      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'>
          <Trans t={t} i18nKey='fields.aclose.warning'/>
        </span>
      </div>
    </>
  );
}

function CloseToInput({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const acloseCondReqGroup = useAtomValue(acloseConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.aclose.label')}
      name='aclose'
      id='aclose-input'
      tip={{
        content: t('fields.aclose.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.AssetOptOut}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.aclose.placeholder')}
      containerId='aclose-field'
      containerClass='mt-4'
      inputClass={((showFormErrors || form.touched.aclose) &&
          (form.fieldErrors.aclose || (!acloseCondReqGroup.isValid && acloseCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.aclose as string}
      onChange={(e) => form.handleOnChange('aclose')(e.target.value)}
      onFocus={form.handleOnFocus('aclose')}
      onBlur={form.handleOnBlur('aclose')}
    />
    {(showFormErrors || form.touched.aclose) && form.fieldErrors.aclose &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.aclose.message.key}
        dict={form.fieldErrors.aclose.message.dict}
      />
    }
    {(showFormErrors || form.touched.aclose) && !acloseCondReqGroup.isValid
      && acloseCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(acloseCondReqGroup.error as any).message.key}
        dict={(acloseCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
