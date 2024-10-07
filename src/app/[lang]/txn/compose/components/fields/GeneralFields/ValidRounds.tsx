import { useEffect } from 'react';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldGroup, ToggleField } from '@/app/[lang]/components/form';
import {
  generalFormControlAtom, storedTxnDataAtom, tipBtnClass, tipContentClass, txnDataAtoms,
} from '@/app/lib/txn-data';
import { defaultUseSugRounds as defaultUseSugRoundsAtom } from '@/app/lib/app-settings';
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
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const defaultUseSugRounds = useAtomValue(defaultUseSugRoundsAtom);
  const setUseSugRounds = useSetAtom(txnDataAtoms.useSugRounds);

  useEffect(() => {
    if (storedTxnData?.useSugRounds === undefined && !form.touched.useSugRounds) {
      setUseSugRounds(defaultUseSugRounds);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[defaultUseSugRounds, storedTxnData]);

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
      containerClass='mt-1 max-w-lg'
      inputClass='toggle-primary'
      labelClass='gap-3'
      value={!!form.values.useSugRounds}
      onChange={(e) => {
        form.setTouched('useSugRounds', true);
        form.handleOnChange('useSugRounds')(e.target.checked);
      }}
    />
  );
}
