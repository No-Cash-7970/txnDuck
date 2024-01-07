import { useSearchParams } from 'next/navigation';
import { ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  Preset,
  assetFreezeFormControlAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function Freeze({ t }: { t: TFunction }) {
  const preset = useSearchParams().get(Preset.ParamName);
  const form = useAtomValue(assetFreezeFormControlAtom);
  // If creation transaction
  return (
    <ToggleField label={t('fields.afrz.label')}
      name='afrz'
      id='afrz-input'
      tip={{
        content: t('fields.afrz.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='afrz-field'
      containerClass='mt-6 max-w-xs'
      inputClass='toggle-primary'
      labelClass='gap-3'
      disabled={preset === Preset.AssetFreeze || preset === Preset.AssetUnfreeze}
      value={!!form.values.afrz}
      onChange={(e) => {
        form.setTouched('afrz', true);
        form.handleOnChange('afrz')(e.target.checked);
      }}
    />
  );
}
