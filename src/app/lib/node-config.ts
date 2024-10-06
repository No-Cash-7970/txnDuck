/** @file Collection of variables and constants for managing node configuration */
import algosdk from "algosdkv3";
import { atomWithReset, atomWithStorage } from 'jotai/utils';
import { atomWithFormControls, atomWithValidate } from "jotai-form";
import { number as YupNumber, string as YupString } from 'yup';
import '@/app/lib/validation-set-locale'; // Run setup for the locales for Yup (`Yup.setLocale()`)
import { splitAtom } from "jotai/utils";
import { validationAtom } from "./utils";
import { UNIT_NAME_MAX_LENGTH } from './txn-data/constants';

/** Name for Algorand MainNet */
export const MAINNET = 'mainnet';
/** Name for Algorand TestNet */
export const TESTNET = 'testnet';
/** Name for Algorand BetaNet */
export const BETANET = 'betanet';
/** Name for Algorand FNet */
export const FNET = 'fnet';
/** Name for Voi MainNet */
export const VOIMAIN = 'voimain';
/** Name for Sandbox */
export const SANDBOX = 'sandbox';
/** Name for custom node */
export const CUSTOM = 'custom';

/** The default coin (native currency) name */
export const DEFAULT_COIN_NAME = 'ALGO';
/** Name of the coin (native currency) for Voi, an Algorand code fork */
export const VOI_COIN_NAME = 'VOI';

/** Node configuration */
export interface NodeConfig {
  /** Name of the network (e.g. "mainnet", "testnet") */
  network: string;
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
}

export const networkURLParamName = 'network';

/** Default MainNet configuration */
export const mainnetNodeConfig: NodeConfig = {
  network: MAINNET,
  nodeServer: 'https://mainnet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default TestNet configuration */
export const testnetNodeConfig: NodeConfig = {
  network: TESTNET,
  nodeServer: 'https://testnet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default BetaNet configuration */
export const betanetNodeConfig: NodeConfig = {
  network: BETANET,
  nodeServer: 'https://betanet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default FNet configuration */
export const fnetNodeConfig: NodeConfig = {
  network: FNET,
  nodeServer: 'https://fnet-api.4160.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
};
/** Default Voi MainNet configuration */
export const voiMainnetNodeConfig: NodeConfig = {
  network: VOIMAIN,
  nodeServer: 'https://mainnet-api.voi.nodely.dev',
  nodeToken: '',
  nodePort: '443',
  nodeHeaders: undefined,
  coinName: VOI_COIN_NAME,
};
/** Default Sandbox configuration */
export const sandboxNodeConfig: NodeConfig = {
  network: SANDBOX,
  nodeServer: 'http://localhost',
  nodeToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  nodePort: '4001',
  nodeHeaders: undefined,
};

/** Mapping of network names to their respective default configurations */
const defaultConfigs: {[k: string]: NodeConfig} = {
  [MAINNET]: mainnetNodeConfig,
  [TESTNET]: testnetNodeConfig,
  [BETANET]: betanetNodeConfig,
  [FNET]: fnetNodeConfig,
  [VOIMAIN]: voiMainnetNodeConfig,
  [SANDBOX]: sandboxNodeConfig,
};

/** The default node configuration */
export const DEFAULT_NODE_CONFIG =
  defaultConfigs[process.env.NEXT_PUBLIC_DEFAULT_NETWORK ?? MAINNET] ?? mainnetNodeConfig;

/** Node configuration that is stored locally (in localStorage) */
export const nodeConfigAtom =
  atomWithStorage<NodeConfig>('nodeConfig', DEFAULT_NODE_CONFIG);

/*
 * Custom Node Configuration form
 */

export type CustomNodeConfig = Omit<NodeConfig, 'network'>;
/** Custom node configuration that is indefinitely stored locally */
export const customNodeAtom =
  atomWithStorage<CustomNodeConfig|null>('customNode', null); // localStorage is used by default

/** Algod URL */
export const urlAtom = atomWithValidate<string>('', {
  validate: v => {
    YupString().required().validateSync(v === '' ? undefined : v);
    return v;
  }
});
/** Algod Port */
export const portAtom = atomWithValidate<number|string|undefined>(undefined, {
  validate: v => {
    YupNumber().min(0).validateSync(v);
    return v;
  }
});
/** Algod Token */
export const tokenAtom = atomWithValidate<string>('', {
  validate: v => {
    YupString().validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Type for a group of atoms that represent an Algod header */
export type HeaderAtomGroup = {
  /** Name of the header (Example: `Content-Type`) */
  name: validationAtom<string>,
  /** Value of the header (Example: `application/octet-stream`) */
  value: validationAtom<string>,
};

/** Algod Headers */
export const headersListAtom = atomWithReset<HeaderAtomGroup[]>([]);
/** Collection of atoms for headers */
export const headersAtom = splitAtom(headersListAtom);

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

/** Coin name (form field value) */
export const coinNameFieldAtom = atomWithValidate<string>('', {
  validate: v => {
    YupString().max(UNIT_NAME_MAX_LENGTH).validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Validation form group for custom-node form */
export const customNodeFormControlAtom = atomWithFormControls({
  url: urlAtom,
  port: portAtom,
  token: tokenAtom,
  coinName: coinNameFieldAtom,
});
