'use client';

import { useTranslation } from "@/app/i18n/client";
import { useSearchParams } from "next/navigation";

type Props = {
  /** Language */
  lng?: string
};

/** Badge that shows the transaction preset being used. Usually in the page title heading */
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
