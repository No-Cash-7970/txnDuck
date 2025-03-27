/** @file Collection of variables and constants for managing node configuration */
import algosdk from "algosdk";
import { atomWithReset, atomWithStorage } from 'jotai/utils';
import { atomWithFormControls, atomWithValidate } from "jotai-form";
import { number as YupNumber, string as YupString } from 'yup';
import '@/app/lib/validation-set-locale'; // Run setup for the locales for Yup (`Yup.setLocale()`)
import { splitAtom } from "jotai/utils";
import { validationAtom } from "./utils";
import { UNIT_NAME_MAX_LENGTH } from './txn-data/constants';

/** List of supported networks. Copied from use-wallet because using use-wallet's `NetworkId` enum
 * causes problems with our modules here. This also allows us to create a subset of supported
 * networks.
 */
export enum NetworkId {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  BETANET = 'betanet',
  FNET = 'fnet',
  LOCALNET = 'localnet',
  VOIMAIN = 'voimain',
  // ARAMIDMAIN = 'aramidmain',
  CUSTOM = 'custom',
}

/** The default coin (native currency) name */
export const DEFAULT_COIN_NAME = 'ALGO';
/** Name of the coin (native currency) for Voi, an Algorand code fork */
export const VOI_COIN_NAME = 'VOI';

/** Node configuration */
export interface NodeConfig {
  /** ID/Name of the network (e.g. "mainnet", "testnet") */
  network: NetworkId | string;
  /** The URL of for the Algod node server */
  nodeServer: string;
  /** Authentication token for using the Algod node server */
  // eslint-disable-next-line max-len
  nodeToken?: string | algosdk.AlgodTokenHeader | algosdk.CustomTokenHeader | algosdk.BaseHTTPClient;
  /** Port for the Algod node server */
  nodePort?: string | number;
  /** HTTP headers for the Algod node server */
  nodeHeaders?: Record<string, string>;
  /** Name of the network's native currency */
  coinName?: string;
  /** If this configuration for a test network. Used by the Mnemonic Wallet provider (which only
   * works on test networks for security)
   */
  isTestnet?: boolean;
  /** CAIP-2 chain ID for WalletConnect */
  caipChainId?: string;
}

export const networkURLParamName = 'network';

/** Default MainNet configuration */
export const mainnetNodeConfig: NodeConfig = {
  network: NetworkId.MAINNET,
  nodeServer: 'https://mainnet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default TestNet configuration */
export const testnetNodeConfig: NodeConfig = {
  network: NetworkId.TESTNET,
  nodeServer: 'https://testnet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
  isTestnet: true,
};
/** Default BetaNet configuration */
export const betanetNodeConfig: NodeConfig = {
  network: NetworkId.BETANET,
  nodeServer: 'https://betanet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default FNet configuration */
export const fnetNodeConfig: NodeConfig = {
  network: NetworkId.FNET,
  nodeServer: 'https://fnet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default Voi MainNet configuration */
export const voiMainnetNodeConfig: NodeConfig = {
  network: NetworkId.VOIMAIN,
  nodeServer: 'https://mainnet-api.voi.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
  coinName: VOI_COIN_NAME,
};
/** Default LocalNet configuration */
export const localnetNodeConfig: NodeConfig = {
  network: NetworkId.LOCALNET,
  nodeServer: 'http://localhost',
  nodeToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  nodePort: '4001',
  nodeHeaders: undefined,
};

/** Mapping of network names to their respective default configurations */
export const defaultConfigs: {[k: string]: NodeConfig} = {
  [NetworkId.MAINNET]: mainnetNodeConfig,
  [NetworkId.TESTNET]: testnetNodeConfig,
  [NetworkId.BETANET]: betanetNodeConfig,
  [NetworkId.FNET]: fnetNodeConfig,
  [NetworkId.VOIMAIN]: voiMainnetNodeConfig,
  [NetworkId.LOCALNET]: localnetNodeConfig,
};

/** The default node configuration */
export const DEFAULT_NODE_CONFIG =
  defaultConfigs[process.env.NEXT_PUBLIC_DEFAULT_NETWORK ?? NetworkId.MAINNET] ?? mainnetNodeConfig;

/** Node configuration that is stored locally (in localStorage) */
export const nodeConfigAtom =
  atomWithStorage<NodeConfig>('nodeConfig', DEFAULT_NODE_CONFIG);

/*
 * Custom Node Configuration form
 */

/** Custom node configuration that is indefinitely stored locally */
export const customNodeAtom =
  atomWithStorage<NodeConfig|null>('customNode', null); // localStorage is used by default

/** Algod URL field on custom configuration form */
export const urlFieldAtom = atomWithValidate<string>('', {
  validate: v => {
    YupString().required().validateSync(v === '' ? undefined : v);
    return v;
  }
});
/** Algod Port field on custom configuration form */
export const portFieldAtom = atomWithValidate<number|string>('', {
  validate: v => {
    YupNumber().min(0).validateSync(v === '' ? undefined : v);
    return v;
  }
});
/** Algod Token field on custom configuration form */
export const tokenFieldAtom = atomWithValidate<string>('', {
  validate: v => {
    YupString().validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Type for a group of atoms for the fields on the custom configuration form that represent an
 * Algod header
 */
export type HeaderAtomGroup = {
  /** Name of the header (Example: `Content-Type`) */
  name: validationAtom<string>,
  /** Value of the header (Example: `application/octet-stream`) */
  value: validationAtom<string>,
};

/** Algod Headers fields on custom configuration form */
export const headersListAtom = atomWithReset<HeaderAtomGroup[]>([]);
/** Collection of atoms for header fields on custom configuration form */
export const headerFieldsAtom = splitAtom(headersListAtom);

/** Header name validation options */
export const headerNameValidateOptions = {
  validate: (v: string) => {
    YupString().required().validateSync(v === '' ? undefined : v);
    return v;
  }
};
/** Header value validation options */
export const headerValueValidateOptions = {
  validate: (v: string) => {
    YupString().validateSync(v);
    return v;
  }
};

/** Coin name field on custom configuration form */
export const coinNameFieldAtom = atomWithValidate<string>('', {
  validate: v => {
    YupString().max(UNIT_NAME_MAX_LENGTH).validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Validation form group for custom-node form */
export const customNodeFormControlAtom = atomWithFormControls({
  url: urlFieldAtom,
  port: portFieldAtom,
  token: tokenFieldAtom,
  coinName: coinNameFieldAtom,
});
