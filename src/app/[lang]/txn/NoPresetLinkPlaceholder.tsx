
import { useTranslation } from "@/app/i18n";
import { IconArrowBigRightLinesFilled, IconArrowBigLeftLinesFilled } from '@tabler/icons-react';
import { use } from "react";

type Props = {
  /** Language */
  lng?: string
};

/** Placeholder for when the "Skip" link button is loading */
export default function NoPresetLinkPlaceholder({ lng }: Props) {
  const { t } = use(useTranslation(lng || '', 'txn_presets'));

  return <a href=''
    className='btn btn-block btn-accent font-normal  text-lg py-1 max-w-3xl flex-wrap'
  >
    <IconArrowBigRightLinesFilled aria-hidden className='rtl:hidden' />
    <IconArrowBigLeftLinesFilled aria-hidden className='hidden rtl:block' />
    {t('skip_btn')}
  </a>;
}
