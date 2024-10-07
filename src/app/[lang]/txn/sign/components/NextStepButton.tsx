'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { useTranslation } from '@/app/i18n/client';
import { storedSignedTxnAtom } from '@/app/lib/txn-data';

type Props = {
  /** Language */
  lng?: string
};

/** Button for going to the next step in the "sign transaction" page */
export default function NextStepButton({ lng }: Props) {
  const { t } = useTranslation(lng || '', 'sign_txn');
  const storedSignedTxn = useAtomValue(storedSignedTxnAtom);
  const currentURLParams = useSearchParams();
  return (
    <Link
      href={{pathname: `/${lng}/txn/send`, query: currentURLParams.toString()}}
      className={'btn btn-primary w-full' + (storedSignedTxn ? '' : ' btn-disabled')}
      tabIndex={storedSignedTxn? undefined : -1}
    >
      {t('send_txn_btn')}
      <IconArrowRight aria-hidden className='rtl:hidden' />
      <IconArrowLeft aria-hidden className='hidden rtl:inline' />
    </Link>
  );
}
