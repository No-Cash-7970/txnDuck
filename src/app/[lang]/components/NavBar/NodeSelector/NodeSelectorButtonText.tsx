'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TFunction } from 'i18next';
import { useAtom } from 'jotai';
import {
  IconBox,
  IconFlask,
  IconSandbox,
  IconServer2,
  IconSquareRoundedLetterV,
  IconTestPipe,
  IconTopologyRing,
} from '@tabler/icons-react';
import * as NodeConfigLib from '@/app/lib/node-config';

/** Text of the trigger button for the node selector menu */
export default function NodeSelectorButtonText({ t }: { t: TFunction }) {
  const [nodeConfig, setNodeConfig] = useAtom(NodeConfigLib.nodeConfigAtom);
  const currentURLParams = useSearchParams();
  const networkURLParam = currentURLParams.get(NodeConfigLib.networkURLParamName);

  useEffect(() => {
    // If the network is specified in the URL parameter, set the current node configuration to the
    // node configuration for the network specified in that URL parameter
    switch (networkURLParam) {
      case NodeConfigLib.MAINNET:
        setNodeConfig(NodeConfigLib.mainnetNodeConfig);
        break;
      case NodeConfigLib.TESTNET:
        setNodeConfig(NodeConfigLib.testnetNodeConfig);
        break;
      case NodeConfigLib.BETANET:
        setNodeConfig(NodeConfigLib.betanetNodeConfig);
        break;
      case NodeConfigLib.FNET:
        setNodeConfig(NodeConfigLib.fnetNodeConfig);
        break;
      case NodeConfigLib.VOIMAIN:
        setNodeConfig(NodeConfigLib.voiMainnetNodeConfig);
        break;
      case NodeConfigLib.SANDBOX:
        setNodeConfig(NodeConfigLib.sandboxNodeConfig);
        break;
      default:
        // There was no valid network specified, so use the stored node configuration (or the
        // default if there is no stored node configuration)
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkURLParam]);

  return (<>
    {nodeConfig?.network === NodeConfigLib.MAINNET && <>
      <IconBox aria-hidden />
      <span className='truncate'>{t('node_selector.mainnet')}</span>
    </>}
    {nodeConfig?.network === NodeConfigLib.TESTNET && <>
      <IconFlask aria-hidden />
      <span className='truncate'>{t('node_selector.testnet')}</span>
    </>}
    {nodeConfig?.network === NodeConfigLib.BETANET && <>
      <IconTestPipe aria-hidden />
      <span className='truncate'>{t('node_selector.betanet')}</span>
    </>}
    {nodeConfig?.network === NodeConfigLib.FNET && <>
      <IconTopologyRing aria-hidden />
      <span className='truncate'>{t('node_selector.fnet')}</span>
    </>}
    {nodeConfig?.network === NodeConfigLib.VOIMAIN && <>
      <IconSquareRoundedLetterV aria-hidden />
      <span className='truncate'>{t('node_selector.voimain')}</span>
    </>}
    {nodeConfig?.network === NodeConfigLib.SANDBOX && <>
      <IconSandbox aria-hidden />
      <span className='truncate'>{t('node_selector.sandbox')}</span>
    </>}
    {nodeConfig?.network === NodeConfigLib.CUSTOM && <>
      <IconServer2 aria-hidden />
      <span className='truncate'>{t('node_selector.custom')}</span>
    </>}
  </>);
}
