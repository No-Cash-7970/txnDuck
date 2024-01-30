/** @file Collection of variables and constants for managing node configuration */

import { type NodeConfig } from '@txnlab/use-wallet';
import { atomWithReset, atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atomWithFormControls, atomWithValidate } from "jotai-form";
import { number as YupNumber, string as YupString } from 'yup';
import '@/app/lib/validation-set-locale'; // Run setup for the locales for Yup (`Yup.setLocale()`)
import { splitAtom } from "jotai/utils";
import { validationAtom } from "./utils";

/** Name for TestNet */
export const TESTNET = 'testnet';
/** Name for MainNet */
export const MAINNET = 'mainnet';
/** Name for BetaNet */
export const BETANET = 'betanet';
/** Name for Sandbox */
export const SANDBOX = 'sandbox';
/** Name for Sandbox */
export const CUSTOM = 'custom';

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
/** Default Sandbox configuration */
export const sandboxNodeConfig: NodeConfig = {
  network: SANDBOX,
  nodeServer: 'http://localhost',
  nodeToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  nodePort: '4001',
  nodeHeaders: undefined,
};

/** Default node configuration */
export const DEFAULT_NODE_CONFIG = testnetNodeConfig;

/* Code adapted from https://github.com/pmndrs/jotai/discussions/1220#discussioncomment-2918007 */
const sessionJSONStorage = createJSONStorage<any>(() => sessionStorage);
/** Node configuration that is temporarily stored locally */
export const nodeConfigAtom =
  atomWithStorage<NodeConfig>('nodeConfig', DEFAULT_NODE_CONFIG, sessionJSONStorage);

export type customNodeConfig = Omit<NodeConfig, 'network'>;
/** Custom node configuration that is indefinitely stored locally */
export const customNodeAtom =
  atomWithStorage<customNodeConfig|null>('customNode', null); // localStorage is used by default

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

  /** Validation form group for custom-node form */
  export const customNodeFormControlAtom = atomWithFormControls({
    url: urlAtom,
    port: portAtom,
    token: tokenAtom,
  });
