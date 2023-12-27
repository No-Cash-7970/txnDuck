import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useDebouncedCallback } from 'use-debounce';
import { TextField } from '@/app/[lang]/components/form';
import {
  Preset,
  assetConfigFormControlAtom,
  caidConditionalRequireAtom,
  getAssetInfo,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
  txnDataAtoms,
} from '@/app/lib/txn-data';
import { nodeConfigAtom } from '@/app/lib/node-config';
import FieldErrorMessage from '../FieldErrorMessage';

export default function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const caidCondReqGroup = useAtomValue(caidConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  const nodeConfig = useAtomValue(nodeConfigAtom);
  const [retrievedAssetInfo, setRetrievedAssetInfo] = useAtom(txnDataAtoms.retrievedAssetInfo);
  const [assetInfoPending, setAssetInfoPending] = useState(false);
  const [assetInfoSuccess, setAssetInfoSuccess] = useState(false);
  const [assetInfoFail, setAssetInfoFail] = useState(false);
  const getAssetInfoDebounced = useDebouncedCallback(assetId => {
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
    if (!assetInfoPending && form.values.caid) {
      setAssetInfoSuccess(false);
      setAssetInfoFail(false);
      setAssetInfoPending(true);
      getAssetInfoDebounced(
        form.values.caid === undefined ? undefined : parseInt(`${form.values.caid}`)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeConfig]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.caid.label')}
      name='caid'
      id='caid-input'
      tip={{
        content: t('fields.caid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.AssetReconfig || preset === Preset.AssetDestroy}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='aclose-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.caid) &&
          (form.fieldErrors.caid || (!caidCondReqGroup.isValid && caidCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.caid as number ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        const parsedValue = value === '' ? undefined : parseInt(value);
        form.handleOnChange('caid')(parsedValue);
        getAssetInfoDebounced(parsedValue);
      }}
      onFocus={form.handleOnFocus('caid')}
      onBlur={form.handleOnBlur('caid')}
      inputMode='numeric'
      helpMsg={(assetInfoPending || assetInfoSuccess || assetInfoFail)
        ? (
          <span className='ps-3'>
            {assetInfoPending && <>
              <span className='loading loading-ring loading-xs align-middle' aria-hidden></span>
              <span className='ms-1 align-middle'>{t('fields.caid.getting_info')}</span>
            </>}
            {assetInfoSuccess &&
              (retrievedAssetInfo?.name ?? <i>{t('fields.caid.get_info_unknown')}</i>)
            }
            {assetInfoFail && <>
              <IconAlertTriangle size={16} aria-hidden className='inline' />
              <span className='ms-1'>{t('fields.caid.get_info_fail')}</span>
            </>}
          </span>
        )
        : undefined
      }
    />
    {(showFormErrors || form.touched.caid) && form.fieldErrors.caid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.caid.message.key}
        dict={form.fieldErrors.caid.message.dict}
      />
    }
    {(showFormErrors || form.touched.caid) && !caidCondReqGroup.isValid && caidCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(caidCondReqGroup.error as any).message.key}
        dict={(caidCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
