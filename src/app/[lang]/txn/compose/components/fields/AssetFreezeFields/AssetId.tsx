import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useDebouncedCallback } from 'use-debounce';
import { TextField } from '@/app/[lang]/components/form';
import {
  Preset,
  assetFreezeFormControlAtom,
  getAssetInfo,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
  txnDataAtoms,
} from '@/app/lib/txn-data';
import { nodeConfigAtom } from '@/app/lib/node-config';
import { assetInfoGet as assetInfoGetSettingAtom } from '@/app/lib/app-settings';
import FieldErrorMessage from '../FieldErrorMessage';
import { removeNonNumericalChars } from '@/app/lib/utils';

export default function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetFreezeFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  const nodeConfig = useAtomValue(nodeConfigAtom);
  const assetInfoGetSetting = useAtomValue(assetInfoGetSettingAtom);
  const [retrievedAssetInfo, setRetrievedAssetInfo] = useAtom(txnDataAtoms.retrievedAssetInfo);
  const [assetInfoPending, setAssetInfoPending] = useState(false);
  const [assetInfoSuccess, setAssetInfoSuccess] = useState(false);
  const [assetInfoFail, setAssetInfoFail] = useState(false);
  const getAssetInfoDebounced = useDebouncedCallback(assetId => {
    if (!assetInfoGetSetting) {
      setAssetInfoSuccess(false);
      setAssetInfoFail(false);
      setAssetInfoPending(false);
      setRetrievedAssetInfo(undefined);
      return;
    }
    setAssetInfoSuccess(false);
    setAssetInfoFail(false);
    setAssetInfoPending(true);
    getAssetInfo(assetId, nodeConfig, setRetrievedAssetInfo)
      .then(() => setAssetInfoSuccess(true))
      .catch(() => setAssetInfoFail(true))
      .finally(() => setAssetInfoPending(false));
  // Delay in ms
  }, 1000);

  useEffect(() => {
    if (!assetInfoPending && form.values.faid) {
      setAssetInfoSuccess(false);
      setAssetInfoFail(false);
      setAssetInfoPending(true);
      getAssetInfoDebounced(
        form.values.faid === undefined ? undefined : parseInt(`${form.values.faid}`)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeConfig]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.faid.label')}
      name='faid'
      id='faid-input'
      tip={{
        content: t('fields.faid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='faid-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.faid) && form.fieldErrors.faid ) ? 'input-error' : ''
      }
      value={form.values.faid as number ?? ''}
      onChange={(e) => {
        const value = removeNonNumericalChars(e.target.value);
        const parsedValue = value === '' ? undefined : parseInt(value);
        form.handleOnChange('faid')(parsedValue);
        getAssetInfoDebounced(parsedValue);
      }}
      onFocus={form.handleOnFocus('faid')}
      onBlur={form.handleOnBlur('faid')}
      inputMode='numeric'
      helpMsg={(assetInfoPending || assetInfoSuccess || assetInfoFail)
        ? (
          <span className='ps-3'>
            {assetInfoPending && <>
              <span className='loading loading-ring loading-xs align-middle' aria-hidden></span>
              <span className='ms-1 align-middle'>{t('fields.faid.getting_info')}</span>
            </>}
            {assetInfoSuccess &&
              (retrievedAssetInfo?.value?.name ?? <i>{t('fields.faid.get_info_unknown')}</i>)
            }
            {assetInfoFail && <>
              <IconAlertTriangle size={16} aria-hidden className='inline' />
              <span className='ms-1'>{t('fields.faid.get_info_fail')}</span>
            </>}
          </span>
        )
        : undefined
      }
    />
    {(showFormErrors || form.touched.faid) && form.fieldErrors.faid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.faid.message.key}
        dict={form.fieldErrors.faid.message.dict}
      />
    }
  </>);
}
