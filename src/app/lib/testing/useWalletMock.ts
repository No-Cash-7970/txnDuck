/**  Mock "connect" functions for fake "foo" wallet */
export const fooConnectFn = jest.fn();
/** Mock "disconnect" functions for fake "foo" wallet */
export const fooDisconnectFn = jest.fn();
/**  Mock "connect" functions for fake "bar" wallet */
export const barConnectFn = jest.fn();

/**
 * Mock for the use-wallet library that DOES NOT mock a connected wallet (Assumed no wallet is
 * connected).
 *
 * From https://react.i18next.com/misc/testing
 *
 * NOTE: In test files, run `jest.mock` for this module before importing any modules that will use
 * this mock module.
 */
export const useWalletUnconnectedMock = {
  PROVIDER_ID: {
    PERA: 'pera',
    DEFLY: 'defly',
    EXODUS: 'exodus',
    MYALGO: 'myalgo',
    DAFFI: 'daffi',
  },
  useWallet: () => ({
    clients: {
      fooWallet: {},
      barWallet: null
    },
    providers: [
      {
        connect: fooConnectFn,
        metadata: { id: 'fooWallet', icon: 'data:image/svg+xml;base64,' },
      },
      {
        connect: barConnectFn,
        metadata: { id: 'barWallet', icon: 'data:image/svg+xml;base64,' },
      },
    ],
  })
};

/**
 * Mock for the use-wallet library that also mocks a connected wallet.
 *
 * From https://react.i18next.com/misc/testing
 *
 * NOTE: In test files, run `jest.mock` for this module before importing any modules that will use
 * this mock module.
 */
export const useWalletConnectedMock = {
  PROVIDER_ID: {
    PERA: 'pera',
    DEFLY: 'defly',
    EXODUS: 'exodus',
    MYALGO: 'myalgo',
    DAFFI: 'daffi',
  },
  useWallet: () => ({
    activeAccount: {
      address: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      providerId: 'fooWallet'
    },
    clients: {
      fooWallet: {
        disconnect: fooDisconnectFn,
        metadata: { id: 'fooWallet', icon: 'data:image/svg+xml;base64,' },
      },
      barWallet: null
    },
    providers: [
      {
        connect: fooConnectFn,
        disconnect: fooDisconnectFn,
        metadata: { id: 'fooWallet', icon: 'data:image/svg+xml;base64,' },
      },
      {
        connect: barConnectFn,
        metadata: { id: 'barWallet', icon: 'data:image/svg+xml;base64,' },
      },
    ],
  })
};
