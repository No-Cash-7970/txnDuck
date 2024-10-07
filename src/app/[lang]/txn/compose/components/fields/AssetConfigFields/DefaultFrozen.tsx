import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { ToggleField } from '@/app/[lang]/components/form';
import { assetConfigFormControlAtom, tipBtnClass, tipContentClass } from '@/app/lib/txn-data';

export default function DefaultFrozen({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  // If creation transaction
  return (!form.values.caid &&
    <ToggleField label={t('fields.apar_df.label')}
      name='apar_df'
      id='apar_df-input'
      tip={{
        content: t('fields.apar_df.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='apar_df-field'
      containerClass='mt-6 max-w-lg'
      inputClass='toggle-primary'
      labelClass='gap-3'
      value={!!form.values.apar_df}
      onChange={(e) => {
        form.setTouched('apar_df', true);
        form.handleOnChange('apar_df')(e.target.checked);
      }}
    />
  );
}
