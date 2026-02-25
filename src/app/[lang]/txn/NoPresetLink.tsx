'use client';

import Link from 'next/link';
import { useTranslation } from "@/app/i18n/client";
import { IconArrowBigRightLinesFilled, IconArrowBigLeftLinesFilled } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

type Props = {
  /** Language */
  lng?: string
};

/** Link that goes to the compose-transaction page without a preset */
export default function NoPresetLink({ lng }: Props) {
  const { t } = useTranslation(lng || '', 'txn_presets');
  const currentURLParams = useSearchParams();
  const urlParamPart = currentURLParams.size ? `?${currentURLParams.toString()}` : '';
  return <Link
    href={(lng ? `/${lng}` : '') + `/txn/compose${urlParamPart}`}
    className='btn btn-block btn-accent font-normal text-lg py-1 max-w-3xl flex-wrap'
  >
    <IconArrowBigRightLinesFilled aria-hidden className='rtl:hidden' />
    <IconArrowBigLeftLinesFilled aria-hidden className='hidden rtl:block' />
    {t('skip_btn')}
  </Link>;
}
