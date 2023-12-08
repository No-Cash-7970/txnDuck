import { useSearchParams } from 'next/navigation';
import { ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  Preset,
  keyRegFormControlAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function Nonparticipation({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  return (!(
      form.values.votekey || form.values.selkey || form.values.sprfkey
      || form.values.votefst || form.values.votelst || form.values.votekd
    ) &&
    <ToggleField label={t('fields.nonpart.label')}
      name='nonpart'
      id='nonpart-input'
      tip={{
        content: t('fields.nonpart.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='nonpart-field'
      containerClass='mt-4 max-w-xs'
      inputClass='toggle-primary'
      disabled={preset === Preset.RegNonpart}
      value={!!form.values.nonpart}
      onChange={(e) => form.handleOnChange('nonpart')(e.target.checked)}
    />
  );
}
