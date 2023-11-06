/** Fields for the compose-transaction form that are for key-registration transaction */

import { NumberField, TextAreaField, TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtom, useAtomValue } from 'jotai';
import { txnDataAtoms } from '@/app/lib/txn-data';

export function VoteKey({ t }: { t: TFunction }) {
  const [voteKey, setVoteKey] = useAtom(txnDataAtoms.votekey);
  const selKey = useAtomValue(txnDataAtoms.selkey);
  const stateProofKey = useAtomValue(txnDataAtoms.sprfkey);
  const voteFst = useAtomValue(txnDataAtoms.votefst);
  const voteLst = useAtomValue(txnDataAtoms.votelst);
  const voteKd = useAtomValue(txnDataAtoms.votekd);
  const nonpart = useAtomValue(txnDataAtoms.nonpart);
  return (!nonpart &&
    <TextField label={t('fields.votekey.label')}
      name='votekey'
      id='votekey-field'
      required={!!(voteKey || selKey || stateProofKey || voteFst || voteLst || voteKd)}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.votekey.placeholder')}
      containerClass='mt-4 max-w-lg'
      value={voteKey}
      onChange={(e) => setVoteKey(e.target.value)}
    />
  );
}

export function SelectionKey({ t }: { t: TFunction }) {
  const [selKey, setSelKey] = useAtom(txnDataAtoms.selkey);
  const voteKey = useAtomValue(txnDataAtoms.votekey);
  const stateProofKey = useAtomValue(txnDataAtoms.sprfkey);
  const voteFst = useAtomValue(txnDataAtoms.votefst);
  const voteLst = useAtomValue(txnDataAtoms.votelst);
  const voteKd = useAtomValue(txnDataAtoms.votekd);
  const nonpart = useAtomValue(txnDataAtoms.nonpart);
  return (!nonpart &&
    <TextField label={t('fields.selkey.label')}
      name='selkey'
      id='selkey-field'
      required={!!(voteKey || selKey || stateProofKey || voteFst || voteLst || voteKd)}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.selkey.placeholder')}
      containerClass='mt-4 max-w-lg'
      value={selKey}
      onChange={(e) => setSelKey(e.target.value)}
    />
  );
}

export function StateProofKey({ t }: { t: TFunction }) {
  const [stateProofKey, setStateProofKey] = useAtom(txnDataAtoms.sprfkey);
  const voteKey = useAtomValue(txnDataAtoms.votekey);
  const selKey = useAtomValue(txnDataAtoms.selkey);
  const voteFst = useAtomValue(txnDataAtoms.votefst);
  const voteLst = useAtomValue(txnDataAtoms.votelst);
  const voteKd = useAtomValue(txnDataAtoms.votekd);
  const nonpart = useAtomValue(txnDataAtoms.nonpart);
  return (!nonpart &&
    <TextAreaField label={t('fields.sprfkey.label')}
      name='sprfkey'
      id='sprfkey-field'
      required={!!(voteKey || selKey || stateProofKey || voteFst || voteLst || voteKd)}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.sprfkey.placeholder')}
      containerClass='mt-4 max-w-lg'
      value={stateProofKey}
      onChange={(e) => setStateProofKey(e.target.value)}
    />
  );
}

export function FirstVoteRound({ t }: { t: TFunction }) {
  const [voteFst, setVoteFst] = useAtom(txnDataAtoms.votefst);
  const voteKey = useAtomValue(txnDataAtoms.votekey);
  const selKey = useAtomValue(txnDataAtoms.selkey);
  const stateProofKey = useAtomValue(txnDataAtoms.sprfkey);
  const voteLst = useAtomValue(txnDataAtoms.votelst);
  const voteKd = useAtomValue(txnDataAtoms.votekd);
  const nonpart = useAtomValue(txnDataAtoms.nonpart);
  return (!nonpart &&
    <NumberField label={t('fields.votefst.label')}
      name='votefst'
      id='votefst-field'
      required={!!(voteKey || selKey || stateProofKey || voteFst || voteLst || voteKd)}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={1}
      step={1}
      value={voteFst ?? ''}
      onChange={
        (e) => setVoteFst(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
    />
  );
}

export function LastVoteRound({ t }: { t: TFunction }) {
  const [voteLst, setVoteLst] = useAtom(txnDataAtoms.votelst);
  const voteKey = useAtomValue(txnDataAtoms.votekey);
  const selKey = useAtomValue(txnDataAtoms.selkey);
  const stateProofKey = useAtomValue(txnDataAtoms.sprfkey);
  const voteFst = useAtomValue(txnDataAtoms.votefst);
  const voteKd = useAtomValue(txnDataAtoms.votekd);
  const nonpart = useAtomValue(txnDataAtoms.nonpart);
  return (!nonpart &&
    <NumberField label={t('fields.votelst.label')}
      name='votelst'
      id='votelst-field'
      required={!!(voteKey || selKey || stateProofKey || voteFst || voteLst || voteKd)}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={1}
      step={1}
      value={voteLst ?? ''}
      onChange={(e) => setVoteLst(e.target.value === '' ? undefined : parseInt(e.target.value))}
    />
  );
}

export function KeyDilution({ t }: { t: TFunction }) {
  const [voteKd, setVoteKd] = useAtom(txnDataAtoms.votekd);
  const voteKey = useAtomValue(txnDataAtoms.votekey);
  const selKey = useAtomValue(txnDataAtoms.selkey);
  const stateProofKey = useAtomValue(txnDataAtoms.sprfkey);
  const voteFst = useAtomValue(txnDataAtoms.votefst);
  const voteLst = useAtomValue(txnDataAtoms.votelst);
  const nonpart = useAtomValue(txnDataAtoms.nonpart);
  return (!nonpart &&
    <NumberField label={t('fields.votekd.label')}
      name='votekd'
      id='votekd-field'
      required={!!(voteKey || selKey || stateProofKey || voteFst || voteLst || voteKd)}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={1}
      step={1}
      value={voteKd ?? ''}
      onChange={(e) => setVoteKd(e.target.value === '' ? undefined : parseInt(e.target.value))}
    />
  );
}

export function Nonparticipation({ t }: { t: TFunction }) {
  const [nonPart, setNonPart] = useAtom(txnDataAtoms.nonpart);
  const voteKey = useAtomValue(txnDataAtoms.votekey);
  const selKey = useAtomValue(txnDataAtoms.selkey);
  const stateProofKey = useAtomValue(txnDataAtoms.sprfkey);
  const voteFst = useAtomValue(txnDataAtoms.votefst);
  const voteLst = useAtomValue(txnDataAtoms.votelst);
  const voteKd = useAtomValue(txnDataAtoms.votekd);
  return (!(voteKey || selKey || stateProofKey || voteFst || voteLst || voteKd) &&
    <ToggleField label={t('fields.nonpart.label')}
      name='nonpart'
      id='nonpart-field'
      inputInsideLabel={true}
      containerClass='mt-4 max-w-xs'
      inputClass='toggle-primary'
      value={nonPart}
      onChange={(e) => setNonPart(e.target.checked)}
    />
  );
}
