'use client';

import { useTranslation } from "@/app/i18n/client";
import { useSearchParams } from "next/navigation";
import { nodeConfigAtom } from "@/app/lib/node-config";
import { useAtomValue } from "jotai";
import { importParamName } from "@/app/lib/utils";
import { Preset } from "@/app/lib/txn-data";

type Props = {
  /** Language */
  lng?: string
};

/** Badge that shows the transaction preset being used. Usually in the page title heading */
export function TxnPresetBadge({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['txn_presets', 'common']);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const currentURLParams = useSearchParams();
  const txnPreset = currentURLParams.get(Preset.ParamName);
  const isImporting = currentURLParams.get(importParamName) !== null;
  return (<>
    {!isImporting && !!txnPreset &&
      <span className='badge sm:badge-lg badge-neutral mx-1'>
        {t(
          [txnPreset + '.heading', 'invalid_preset'],
          {coinName: nodeConfig.coinName ?? t('algo_other')}
        )}
      </span>
    }
  </>);
}
