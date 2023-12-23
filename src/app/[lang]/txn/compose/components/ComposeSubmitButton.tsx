import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useAtomValue, useStore } from 'jotai';
import { useTranslation } from '@/app/i18n/client';
import * as AppSettings from '@/app/lib/app-settings';
import {
  Preset,
  extractTxnDataFromAtoms,
  isFormValid,
  loadStoredTxnData,
  showFormErrorsAtom,
  storedTxnDataAtom,
} from '@/app/lib/txn-data';

type Props = {
  /** Language */
  lng?: string
};

/** Submit button for the "Compose Transaction" form */
export default function ComposeSubmitButton({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  /** A flag for indicating that the form is being submitted */
  const [submittingForm, setSubmittingForm] = useState(false);
  const jotaiStore = useStore();
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const ignoreFormErrors = useAtomValue(AppSettings.ignoreFormErrorsAtom);
  const router = useRouter();
  const currentURLParams = useSearchParams();
  const preset = currentURLParams.get(Preset.ParamName);

  useEffect(
    () => loadStoredTxnData(submittingForm, preset, jotaiStore, storedTxnData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedTxnData, preset]
  );

  /** "Submit" the form by processing the form data and saving the data into local storage if there
   * are no form validation errors.
   */
  const submitData = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if the form is valid only if the "ignore form error" setting is off
    if (!ignoreFormErrors && !isFormValid(preset, jotaiStore)) {
      jotaiStore.set(showFormErrorsAtom, true);
      return;
    }

    // Going to "submit" the form data
    setSubmittingForm(true);
    // "Submit" transaction data by storing it into local/session storage
    jotaiStore.set(storedTxnDataAtom, extractTxnDataFromAtoms(preset, jotaiStore));
    // Go to sign-transaction page
    router.push(`/${lng}/txn/sign` + (currentURLParams.size ? `?${currentURLParams}` : ''));
  };

  return (<>
    <button type='submit' className='btn btn-primary w-full' onClick={submitData}>
      {t('sign_txn_btn')}
      <IconArrowRight aria-hidden className='rtl:hidden' />
      <IconArrowLeft aria-hidden className='hidden rtl:inline' />
    </button>
  </>);
}
