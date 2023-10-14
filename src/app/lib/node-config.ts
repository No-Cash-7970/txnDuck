import { type NodeConfig } from "@txnlab/use-wallet";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

/** Name for TestNet */
export const TESTNET = 'testnet';
/** Name for MainNet */
export const MAINNET = 'mainnet';
/** Name for BetaNet */
export const BETANET = 'betanet';

/** Default TestNet configuration */
export const testnetNodeConfig: NodeConfig = {
  network: TESTNET,
  nodeServer: 'https://testnet-api.algonode.cloud',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default MainNet configuration */
export const mainnetNodeConfig: NodeConfig = {
  network: MAINNET,
  nodeServer: 'https://mainnet-api.algonode.cloud',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default BetaNet configuration */
export const betanetNodeConfig: NodeConfig = {
  network: BETANET,
  nodeServer: 'https://betanet-api.algonode.cloud',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};

export const DEFAULT_NODE_CONFIG = testnetNodeConfig;

/* Code adapted from https://github.com/pmndrs/jotai/discussions/1220#discussioncomment-2918007 */
const storage = createJSONStorage<any>(() => sessionStorage);
/** Node configuration that is temporarily stored locally */
export const nodeConfigAtom =
  atomWithStorage<NodeConfig>('nodeConfig', DEFAULT_NODE_CONFIG, storage);
