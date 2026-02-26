import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useAtomValue, useStore } from 'jotai';
import { useTranslation } from '@/app/i18n/client';
import * as AppSettings from '@/app/lib/app-settings';
import {
  extractTxnDataFromAtoms,
  isFormValid,
  loadStoredTxnData,
  Preset,
  showFormErrorsAtom,
  getStoredTxnDataAtom,
  txnGrpIdxParamName,
  txnGrpEditParamName,
} from '@/app/lib/txn-data';

type Props = {
  /** Language */
  lng?: string
};

/** Submit button for the "Compose Transaction" form. This is separated from the component for the
 * "Compose Transaction" form to reduce from React re-rendering all components in the form when
 * transaction data is loaded or updated.
 */
export default function ComposeSubmitButton({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  const jotaiStore = useStore();
  /** A flag for indicating that the form is being submitted */
  const [submittingForm, setSubmittingForm] = useState(false);
  const disallowFormErrors = useAtomValue(AppSettings.disallowFormErrorsAtom);

  const router = useRouter();
  const currentURLParams = useSearchParams();
  const preset = currentURLParams.get(Preset.ParamName);
  const grpIdx = parseInt(currentURLParams.get(txnGrpIdxParamName) ?? '');

  const storedTxnDataAtom = getStoredTxnDataAtom(currentURLParams);
  const storedTxnData = useAtomValue(storedTxnDataAtom);

  // Load transaction data
  useEffect(
    () => loadStoredTxnData(submittingForm, jotaiStore, currentURLParams, storedTxnData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedTxnData]
  );

  /** "Submit" the form by processing the form data and saving the data into local storage if there
   * are no form validation errors.
   */
  const submitData = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if the form is valid only if the "do not allow form errors" setting is on
    if (disallowFormErrors && !isFormValid(preset, jotaiStore)) {
      jotaiStore.set(showFormErrorsAtom, true);
      return;
    }

    // Going to "submit" the form data
    setSubmittingForm(true);
    // "Submit" transaction data by storing it into local/session storage
    jotaiStore.set(storedTxnDataAtom, extractTxnDataFromAtoms(preset as Preset, jotaiStore));

    router.push(isNaN(grpIdx) // Is transaction a normal transaction (not part of a group)?
      // Yes, go to sign-transaction page (only preserve preset URL parameter)
      ? `/${lng}/txn/sign` + (preset ? `?${Preset.ParamName}=${preset}` : '')
      // No, transaction is part of a group, so go back to compose group page
      : `/${lng}/group/compose`
    );
  };

  return (<>
    <button type='submit' className='btn btn-primary w-full'
      onClick={submitData}
      disabled={submittingForm}
    >
      {submittingForm
        ? <span className='loading loading-spinner' />
        : <>
          {isNaN(grpIdx) && t('sign_txn_btn')}
          {!isNaN(grpIdx) && <>
            {currentURLParams.get(txnGrpEditParamName) === null
              ? t('grp_compose_btn') : t('grp_compose_save_btn')}
          </>}
          <IconArrowRight aria-hidden className='rtl:hidden' />
          <IconArrowLeft aria-hidden className='hidden rtl:inline' />
        </>
      }
    </button>
  </>);
}
