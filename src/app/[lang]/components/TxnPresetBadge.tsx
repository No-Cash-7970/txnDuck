'use client';

import { useTranslation } from "@/app/i18n/client";
import { useSearchParams } from "next/navigation";

type Props = {
  /** Language */
  lng?: string
};

export function TxnPresetBadge({ lng }: Props) {
  const { t } = useTranslation(lng || '', 'txn_presets');
  const txnPresetName = useSearchParams().get('preset');
  return (<>
    {!!txnPresetName &&
      <span className='badge badge-lg badge-neutral mx-1'>
        {t(txnPresetName + '.heading')}
      </span>
    }
  </>);
}
