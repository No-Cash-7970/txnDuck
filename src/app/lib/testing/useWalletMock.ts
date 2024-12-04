/**  Mock "connect" functions for fake "foo" wallet */
export const fooConnectFn = jest.fn();
/** Mock "disconnect" functions for fake "foo" wallet */
export const fooDisconnectFn = jest.fn();
/**  Mock "connect" functions for fake "bar" wallet */
export const barConnectFn = jest.fn();
/**  Mock "connect" functions for fake "magic" wallet */
export const magicConnectFn = jest.fn();
/** Mock "disconnect" functions for fake "magic" wallet */
export const magicDisconnectFn = jest.fn();

/** Mock for the use-wallet library that DOES NOT mock a connected wallet (Assumed no wallet is
 * connected).
 *
 * NOTE: In test files, run `jest.mock` for this module before importing any modules that will use
 * this mock module.
 */
export const useWalletUnconnectedMock = {
  WalletId: {
    PERA: 'pera',
    DEFLY: 'defly',
    EXODUS: 'exodus',
    MAGIC: 'magic',
  },
  useWallet: () => ({
    setActiveNetwork: jest.fn(),
    activeWallet: null,
    wallets: [
      {
        id: 'fooWallet',
        connect: fooConnectFn,
        metadata: { icon: 'data:image/svg+xml;base64,' },
      },
      {
        id: 'barWallet',
        connect: barConnectFn,
        metadata: { icon: 'data:image/svg+xml;base64,' },
      },
      {
        id: 'magic',
        connect: magicConnectFn,
        metadata: { icon: 'data:image/svg+xml;base64,' },
      },
    ],
  })
};

/** Mock for the use-wallet library that also mocks a connected wallet.
 *
 * NOTE: In test files, run `jest.mock` for this module before importing any modules that will use
 * this mock module.
 */
export const useWalletConnectedMock = {
  WalletId: {
    PERA: 'pera',
    DEFLY: 'defly',
    EXODUS: 'exodus',
    MAGIC: 'magic',
  },
  useWallet: () => ({
    setActiveNetwork: jest.fn(),
    activeAccount: {
      address: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    },
    activeWallet: {
      id: 'fooWallet',
      connect: fooConnectFn,
      disconnect: fooDisconnectFn,
      metadata: { icon: 'data:image/svg+xml;base64,' },
    },
    wallets: [
      {
        id: 'fooWallet',
        connect: fooConnectFn,
        disconnect: fooDisconnectFn,
        metadata: { icon: 'data:image/svg+xml;base64,' },
      },
      {
        id: 'barWallet',
        connect: barConnectFn,
        metadata: { icon: 'data:image/svg+xml;base64,' },
      },
      {
        id: 'magic',
        connect: magicConnectFn,
        disconnect: magicDisconnectFn,
        metadata: { icon: 'data:image/svg+xml;base64,' },
      },
    ],
  })
};
