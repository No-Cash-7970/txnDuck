import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import i18nextClientMock from "@/app/lib/testing/i18nextClientMock";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));
// Mock i18next before modules that use it are imported. This needs to be mocked because it is a
// dependency of a child client component.
jest.mock('react-i18next', () => i18nextClientMock);
// Mock the utils library because of the use of `fetch()`. This needs to be mocked because it is a
// dependency of a child client component.
jest.mock('../../../lib/Utils.ts', () => ({
  dataUrlToBytes: async (dataUrl: string) => new Uint8Array()
}));
// Mock algokit to prevent sending real HTTP requests because it is a dependency of a child client
// component.
jest.mock('@algorandfoundation/algokit-utils', () => ({
  getAlgoClient: () => ({ sendRawTransaction: () => ({ do: () =>  ({}) }) }),
  waitForConfirmation: () => ({ get_obj_for_encoding: () => ({}) })
}));

import SendTxnPage from "./page";

describe('Send Transaction Page', () => {

  it('has builder steps', () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.send/)).toBeInTheDocument();
  });

  it('has page title heading', () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('immediately attempts to send stored signed transaction', async () => {
    sessionStorage.setItem('signedTxn', JSON.stringify('data:application/octet-stream;base64,'));
    render(<SendTxnPage params={{lang: ''}} />);
    expect(await screen.findByText('txn_confirm_wait')).toBeInTheDocument();
  });

});
