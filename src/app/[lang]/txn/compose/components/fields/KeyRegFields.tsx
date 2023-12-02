/** Fields for the compose-transaction form that are for key-registration transaction */

import { useSearchParams } from 'next/navigation';
import { NumberField, TextAreaField, TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  keyRegFormControlAtom,
  presetAtom,
  selkeyConditionalRequireAtom,
  showFormErrorsAtom,
  sprfkeyConditionalRequireAtom,
  tipBtnClass,
  tipContentClass,
  votefstConditionalRequireAtom,
  votekdConditionalRequireAtom,
  votekeyConditionalRequireAtom,
  votelstConditionalRequireAtom
} from '@/app/lib/txn-data';
import { useEffect } from 'react';
import FieldErrorMessage from './FieldErrorMessage';

export function VoteKey({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votekeyCondReqGroup = useAtomValue(votekeyConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <TextField label={t('fields.votekey.label')}
      name='votekey'
      id='votekey-input'
      tip={{
        content: t('fields.votekey.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={!!(form.values.votekey || form.values.selkey || form.values.sprfkey
        || form.values.votefst || form.values.votelst || form.values.votekd
        || preset === Preset.RegOnline
      )}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.votekey.placeholder')}
      containerId='votekey-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.votekey) &&
          (form.fieldErrors.votekey || (!votekeyCondReqGroup.isValid && votekeyCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.votekey as string}
      onChange={(e) => form.handleOnChange('votekey')(e.target.value)}
      onFocus={form.handleOnFocus('votekey')}
      onBlur={form.handleOnBlur('votekey')}
    />
    {(showFormErrors || form.touched.votekey) && form.fieldErrors.votekey &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votekey.message.key}
        dict={form.fieldErrors.votekey.message.dict}
      />
    }
    {(showFormErrors || form.touched.votekey) && !votekeyCondReqGroup.isValid
      && votekeyCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votekeyCondReqGroup.error as any).message.key}
        dict={(votekeyCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function SelectionKey({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const selkeyCondReqGroup = useAtomValue(selkeyConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <TextField label={t('fields.selkey.label')}
      name='selkey'
      id='selkey-input'
      tip={{
        content: t('fields.selkey.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={!!(form.values.votekey || form.values.selkey || form.values.sprfkey
        || form.values.votefst || form.values.votelst || form.values.votekd
        || preset === Preset.RegOnline
      )}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.selkey.placeholder')}
      containerId='selkey-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.selkey) &&
          (form.fieldErrors.selkey || (!selkeyCondReqGroup.isValid && selkeyCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.selkey as string}
      onChange={(e) => form.handleOnChange('selkey')(e.target.value)}
      onFocus={form.handleOnFocus('selkey')}
      onBlur={form.handleOnBlur('selkey')}
    />
    {(showFormErrors || form.touched.selkey) && form.fieldErrors.selkey &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.selkey.message.key}
        dict={form.fieldErrors.selkey.message.dict}
      />
    }
    {(showFormErrors || form.touched.selkey) && !selkeyCondReqGroup.isValid
      && selkeyCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(selkeyCondReqGroup.error as any).message.key}
        dict={(selkeyCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function StateProofKey({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const sprfkeyCondReqGroup = useAtomValue(sprfkeyConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <TextAreaField label={t('fields.sprfkey.label')}
      name='sprfkey'
      id='sprfkey-input'
      tip={{
        content: t('fields.sprfkey.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={!!(form.values.votekey || form.values.selkey || form.values.sprfkey
        || form.values.votefst || form.values.votelst || form.values.votekd
        || preset === Preset.RegOnline
      )}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.sprfkey.placeholder')}
      containerId='sprfkey-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.sprfkey) &&
          (form.fieldErrors.sprfkey || (!sprfkeyCondReqGroup.isValid && sprfkeyCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.sprfkey as string}
      onChange={(e) => form.handleOnChange('sprfkey')(e.target.value)}
      onFocus={form.handleOnFocus('sprfkey')}
      onBlur={form.handleOnBlur('sprfkey')}
    />
    {(showFormErrors || form.touched.sprfkey) && form.fieldErrors.sprfkey &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.sprfkey.message.key}
        dict={form.fieldErrors.sprfkey.message.dict}
      />
    }
    {(showFormErrors || form.touched.sprfkey) && !sprfkeyCondReqGroup.isValid
      && sprfkeyCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(sprfkeyCondReqGroup.error as any).message.key}
        dict={(sprfkeyCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function FirstVoteRound({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votefstCondReqGroup = useAtomValue(votefstConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <NumberField label={t('fields.votefst.label')}
      name='votefst'
      id='votefst-input'
      tip={{
        content: t('fields.votefst.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={!!(form.values.votekey || form.values.selkey || form.values.sprfkey
        || form.values.votefst || form.values.votelst || form.values.votekd
        || preset === Preset.RegOnline
      )}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='votefst-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.votefst) &&
          (form.fieldErrors.votefst || (!votefstCondReqGroup.isValid && votefstCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={form.values.votefst as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('votefst')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('votefst')}
      onBlur={form.handleOnBlur('votefst')}
    />
    {(showFormErrors || form.touched.votefst) && form.fieldErrors.votefst &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votefst.message.key}
        dict={form.fieldErrors.votefst.message.dict}
      />
    }
    {(showFormErrors || form.touched.votefst) && !votefstCondReqGroup.isValid
      && votefstCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votefstCondReqGroup.error as any).message.key}
        dict={(votefstCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function LastVoteRound({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votelstCondReqGroup = useAtomValue(votelstConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <NumberField label={t('fields.votelst.label')}
      name='votelst'
      id='votelst-input'
      tip={{
        content: t('fields.votelst.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={!!(form.values.votekey || form.values.selkey || form.values.sprfkey
        || form.values.votefst || form.values.votelst || form.values.votekd
        || preset === Preset.RegOnline
      )}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='votelst-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.votelst) &&
          (form.fieldErrors.votelst || (!votelstCondReqGroup.isValid && votelstCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={form.values.votelst as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('votelst')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('votelst')}
      onBlur={form.handleOnBlur('votelst')}
    />
    {(showFormErrors || form.touched.votelst) && form.fieldErrors.votelst &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votelst.message.key}
        dict={form.fieldErrors.votelst.message.dict}
      />
    }
    {(showFormErrors || form.touched.votelst) && !votelstCondReqGroup.isValid
      && votelstCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votelstCondReqGroup.error as any).message.key}
        dict={(votelstCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function KeyDilution({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votekdCondReqGroup = useAtomValue(votekdConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <NumberField label={t('fields.votekd.label')}
      name='votekd'
      id='votekd-input'
      tip={{
        content: t('fields.votekd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={!!(form.values.votekey || form.values.selkey || form.values.sprfkey
        || form.values.votefst || form.values.votelst || form.values.votekd
        || preset === Preset.RegOnline
      )}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='votekd-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.votekd) &&
          (form.fieldErrors.votekd || (!votekdCondReqGroup.isValid && votekdCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={0}
      step={1}
      value={form.values.votekd as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('votekd')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('votekd')}
      onBlur={form.handleOnBlur('votekd')}
    />
    {(showFormErrors || form.touched.votekd) && form.fieldErrors.votekd &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votekd.message.key}
        dict={form.fieldErrors.votekd.message.dict}
      />
    }
    {(showFormErrors || form.touched.votekd) && !votekdCondReqGroup.isValid
      && votekdCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votekdCondReqGroup.error as any).message.key}
        dict={(votekdCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function Nonparticipation({ t }: { t: TFunction }) {
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
