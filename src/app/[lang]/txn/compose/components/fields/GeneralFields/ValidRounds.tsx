import { FieldGroup, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  generalFormControlAtom, tipBtnClass, tipContentClass,
} from '@/app/lib/txn-data';
import FirstValid from './FirstValid';
import LastValid from './LastValid';

export default function ValidRounds({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  return (
    <FieldGroup>
      <UseSugRoundsInput t={t} />
      {!form.values.useSugRounds && <>
        <FirstValid t={t} />
        <LastValid t={t} />
      </>}
    </FieldGroup>
  );
}

export function UseSugRoundsInput({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  return (
    <ToggleField label={t('fields.use_sug_rounds.label')}
      name='use_sug_rounds'
      id='useSugRounds-input'
      tip={{
        content: t('fields.use_sug_rounds.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='useSugRounds-field'
      containerClass='mt-4 max-w-xs'
      inputClass='toggle-primary'
      value={!!form.values.useSugRounds}
      onChange={(e) => {
        form.setTouched('useSugRounds', true);
        form.handleOnChange('useSugRounds')(e.target.checked);
      }}
    />
  );
}
