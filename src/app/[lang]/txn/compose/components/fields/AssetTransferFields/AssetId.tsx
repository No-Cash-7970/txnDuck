import { useEffect, useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import { useAtom, useAtomValue } from 'jotai';
import { useDebouncedCallback } from 'use-debounce';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  assetTransferFormControlAtom,
  getAssetInfo,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
  txnDataAtoms,
} from '@/app/lib/txn-data';
import { nodeConfigAtom } from '@/app/lib/node-config';
import { assetInfoGet as assetInfoGetSettingAtom } from '@/app/lib/app-settings';
import { removeNonNumericalChars } from '@/app/lib/utils';

export default function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
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
    // Try to get asset info from querying a node when we have an asset ID an no asset info stored
    if (!assetInfoPending && form.values.xaid) {
      setAssetInfoSuccess(false);
      setAssetInfoFail(false);
      setAssetInfoPending(true);
      getAssetInfoDebounced(
        form.values.xaid === undefined ? undefined : parseInt(`${form.values.xaid}`)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeConfig]);

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
      placeholder='00000'
      containerId='xaid-field'
      containerClass='mt-6 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.xaid) && form.fieldErrors.xaid) ? 'input-error' : ''
      }
      value={form.values.xaid as number ?? ''}
      onChange={(e) => {
        const value = removeNonNumericalChars(e.target.value);
        const parsedValue = value === '' ? undefined : parseInt(value);
        form.handleOnChange('xaid')(parsedValue);
        getAssetInfoDebounced(parsedValue);
      }}
      onFocus={form.handleOnFocus('xaid')}
      onBlur={form.handleOnBlur('xaid')}
      inputMode='numeric'
      helpMsg={(assetInfoPending || assetInfoSuccess || assetInfoFail)
        ? (
          <span className='ps-3'>
            {assetInfoPending && <>
              <span className='loading loading-ring loading-xs align-middle' aria-hidden></span>
              <span className='ms-1 align-middle'>{t('fields.xaid.getting_info')}</span>
            </>}
            {assetInfoSuccess &&
              (retrievedAssetInfo?.value?.name ?? <i>{t('fields.xaid.get_info_unknown')}</i>)
            }
            {assetInfoFail && <>
              <IconAlertTriangle size={16} aria-hidden className='inline' />
              <span className='ms-1'>{t('fields.xaid.get_info_fail')}</span>
            </>}
          </span>
        )
        : undefined
      }
    />
    {(showFormErrors || form.touched.xaid) && form.fieldErrors.xaid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.xaid.message.key}
        dict={form.fieldErrors.xaid.message.dict}
      />
    }
  </>);
}
