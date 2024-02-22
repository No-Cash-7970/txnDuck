'use client';

import { useTranslation } from "@/app/i18n/client";
import { useSearchParams } from "next/navigation";
import { nodeConfigAtom } from "@/app/lib/node-config";
import { useAtomValue } from "jotai";

type Props = {
  /** Language */
  lng?: string
};

/** Badge that shows the transaction preset being used. Usually in the page title heading */
export function TxnPresetBadge({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['txn_presets', 'common']);
  const txnPresetName = useSearchParams().get('preset');
  const nodeConfig = useAtomValue(nodeConfigAtom);
  return (<>
    {!!txnPresetName &&
      <span className='badge badge-lg badge-neutral mx-1'>
        {t(txnPresetName + '.heading', {coinName: nodeConfig.coinName ?? t('algo_other')})}
      </span>
    }
  </>);
}
