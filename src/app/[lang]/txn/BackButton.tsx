'use client';

import Link from 'next/link';
import { useTranslation } from "@/app/i18n/client";
import { useSearchParams } from 'next/navigation';
import { txnGrpIdxParamName } from '@/app/lib/txn-data';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

type Props = {
  /** Language */
  lng?: string
};

/** Back button link */
export default function BackLink({ lng }: Props) {
  const { t } = useTranslation(lng || '', 'txn_presets');
  const currentURLParams = useSearchParams();
  return currentURLParams.get(txnGrpIdxParamName) !== null &&
    <Link className='btn' href={`/${lng}/group/compose`}>
      <IconChevronLeft aria-hidden className='rtl:hidden' />
      <IconChevronRight aria-hidden className='hidden rtl:block' />
      {t('back_btn')}
    </Link>;
}
