import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  betanetNodeConfig,
  fnetNodeConfig,
  mainnetNodeConfig,
  testnetNodeConfig,
  localnetNodeConfig,
  voiMainnetNodeConfig as voiMainnetNodeConfig,
} from '@/app/lib/node-config';
import { type NodeConfig } from '@/app/lib/node-config';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
// Jotai provider must be imported after the mock classes are imported
import { JotaiProvider, ToastProvider, ToastViewport } from '@/app/[lang]/components';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock Next navigation
const routerPushMockFn = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMockFn }),
  usePathname: () => '/current/url/of/page',
  useSearchParams: () => ({ get: () => '' }),
}));

// Mock algosdk
jest.mock('algosdk', () => ({
  ...jest.requireActual('algosdk'),
  Algodv2: class {
    token: string;
    constructor(token: string) { this.token = token; }
    ready() {
      return {
        do: async () => {
          if (this.token === 'fail') throw Error;
          else return {};
        }
      };
    }
  }
}));

// Mock the wallet provider
jest.mock('../../wallet/WalletProvider.tsx', () => 'div');

import NodeSelector from './NodeSelector';

describe('Node Selector', () => {

  it('displays "TestNet" button if the node configuration is set for TestNet', async () => {
    localStorage.setItem('nodeConfig', JSON.stringify(testnetNodeConfig));
    render(<NodeSelector />);
    expect(await screen.findByText(/node_selector.testnet/)).toBeInTheDocument();
  });

  it('displays "MainNet" button if the node configuration is set for MainNet', async () => {
    localStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);
    expect(await screen.findByText(/node_selector.mainnet/)).toBeInTheDocument();
  });

  it('displays "BetaNet" button if the node configuration is set for BetaNet', async () => {
    localStorage.setItem('nodeConfig', JSON.stringify(betanetNodeConfig));
    render(<NodeSelector />);
    expect(await screen.findByText(/node_selector.betanet/)).toBeInTheDocument();
  });

  it('displays "FNet" button if the node configuration is set for FNet', async () => {
    localStorage.setItem('nodeConfig', JSON.stringify(fnetNodeConfig));
    render(<NodeSelector />);
    expect(await screen.findByText(/node_selector.fnet/)).toBeInTheDocument();
  });

  it('displays "Voi MainNet" button if the node configuration is set for Voi MainNet', async () => {
    localStorage.setItem('nodeConfig', JSON.stringify(voiMainnetNodeConfig));
    render(<NodeSelector />);
    expect(await screen.findByText(/node_selector.voimain/)).toBeInTheDocument();
  });

  it('displays "LocalNet" button if the node configuration is set for LocalNet', async () => {
    localStorage.setItem('nodeConfig', JSON.stringify(localnetNodeConfig));
    render(<NodeSelector />);
    expect(await screen.findByText(/node_selector.localnet/)).toBeInTheDocument();
  });

  it('sets node configuration to TestNet configuration when "TestNet" is selected', async () => {
    // Set config to something that is not TestNet
    localStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button')); // Open menu
    await userEvent.click(screen.getByText('node_selector.testnet'));
    const nodeConfig = JSON.parse(localStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('testnet');
    expect(routerPushMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to MainNet configuration when "MainNet" is selected', async () => {
    // Set config to something that is not MainNet
    localStorage.setItem('nodeConfig', JSON.stringify(testnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button')); // Open menu
    await userEvent.click(screen.getByText('node_selector.mainnet'));
    const nodeConfig = JSON.parse(localStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('mainnet');
    expect(routerPushMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to BetaNet configuration when "BetaNet" is selected', async () => {
    // Set config to something that is not BetaNet
    localStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button')); // Open menu
    await userEvent.click(screen.getByText('node_selector.betanet'));
    const nodeConfig = JSON.parse(localStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('betanet');
    expect(routerPushMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to FNet configuration when "FNet" is selected', async () => {
    // Set config to something that is not FNet
    localStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button')); // Open menu
    await userEvent.click(screen.getByText('node_selector.fnet'));
    const nodeConfig = JSON.parse(localStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('fnet');
    expect(routerPushMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to Voi MainNet configuration when "Voi MainNet" is selected',
  async () => {
    // Set config to something that is not Voi MainNet
    localStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button')); // Open menu
    await userEvent.click(screen.getByText('node_selector.voimain'));
    const nodeConfig = JSON.parse(localStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('voimain');
    expect(routerPushMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to LocalNet configuration when "LocalNet" is selected', async () => {
    // Set config to something that is not LocalNet
    localStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button')); // Open menu
    await userEvent.click(screen.getByText('node_selector.localnet'));
    const nodeConfig = JSON.parse(localStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('localnet');
    expect(routerPushMockFn).toHaveBeenCalledTimes(1);
  });

  describe('View Node Configuration Dialog', () => {

    // eslint-disable-next-line max-len
    it('shows current node configuration when "View current configuration" button is clicked in node selector menu',
    async () => {
      localStorage.setItem('nodeConfig', JSON.stringify({
        network: 'betanet',
        nodeServer: 'https://foobar.example.com',
        nodeToken: 'beeeeeeeeeeeeeeeeeeeeeeeeeeeep',
        nodePort: '42',
        nodeHeaders: {bar: 'baz qux'},
      }));
      render(<NodeSelector />);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "View current configuration button"
      await userEvent.click(screen.getByText('node_selector.view_config.btn'));

      expect(screen.getByText('node_selector.view_config.heading')).toBeInTheDocument();
      expect(screen.getByText('node_selector.view_config.url_heading')).toBeInTheDocument();
      expect(screen.getByText('https://foobar.example.com')).toBeInTheDocument();
      expect(screen.getByText('node_selector.view_config.port_heading')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('node_selector.view_config.token_heading')).toBeInTheDocument();
      expect(screen.getByText('beeeeeeeeeeeeeeeeeeeeeeeeeeeep')).toBeInTheDocument();
      expect(screen.getByText('node_selector.view_config.headers_heading')).toBeInTheDocument();
      expect(screen.getByText(/baz qux/)).toBeInTheDocument();
    });

    it('shows node is online if node responds with "OK" after clicking "Test" button', async () => {
      localStorage.setItem('nodeConfig', JSON.stringify({
        network: 'testnet',
        nodeServer: 'https://foobar.example.com',
        nodeToken: '',
        nodePort: '42',
        nodeHeaders: {bar: 'baz qux'},
      }));
      render(<NodeSelector />);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "View current configuration" button
      await userEvent.click(screen.getByText('node_selector.view_config.btn'));
      // Click "Test" button
      await userEvent.click(screen.getByText('node_selector.view_config.test_btn'));

      expect(screen.getByText(/node_selector.view_config.test_pass/)).toBeInTheDocument();
    });

    it('shows node is NOT online if node does NOT respond with "OK" after clicking "Test" button',
    async () => {
      localStorage.setItem('nodeConfig', JSON.stringify({
        network: 'mainnet',
        nodeServer: 'https://foobar.example.com',
        // The token set to "fail" triggers the mock node response to be an error response
        nodeToken: 'fail',
        nodePort: '42',
        nodeHeaders: {bar: 'baz qux'},
      }));
      render(<NodeSelector />);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "View current configuration" button
      await userEvent.click(screen.getByText('node_selector.view_config.btn'));
      // Click "Test" button
      await userEvent.click(screen.getByText('node_selector.view_config.test_btn'));

      expect(screen.getByText(/node_selector.view_config.test_fail/)).toBeInTheDocument();
    });

  });

  describe('Custom Node Configuration Dialog', () => {

    it('has instructions', async () => {
      render(<NodeSelector />);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "Custom config" button
      await userEvent.click(screen.getByText('node_selector.custom_config.set_btn'));

      expect(await screen.findByText('node_selector.custom_config.instructions'))
        .toBeInTheDocument();
    });

    it('sets current node configuration specified configuration when form is submitted',
    async () => {
      render(<NodeSelector />);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "Custom config" button
      await userEvent.click(screen.getByText('node_selector.custom_config.set_btn'));
      // Fill out form fields
      await userEvent.click(screen.getByLabelText(/node_selector.view_config.url/));
      await userEvent.paste('https://foobar.example2.net');
      await userEvent.click(screen.getByLabelText(/node_selector.view_config.port/));
      await userEvent.paste('123');
      await userEvent.click(screen.getByLabelText(/node_selector.view_config.token/));
      await userEvent.paste('my_super_special_awesome_token');
      await userEvent.click(screen.getByText(/node_selector.custom_config.add_header_btn/));
      await userEvent.click(screen.getByLabelText(/node_selector.custom_config.header_name_label/));
      await userEvent.paste('X-My-Header');
      await userEvent.click(
        screen.getByLabelText(/node_selector.custom_config.header_value_label/)
      );
      await userEvent.paste('hello');
      await userEvent.click(screen.getByLabelText(/node_selector.view_config.coin_name/));
      await userEvent.paste('COIN');
      // Submit
      await userEvent.click(screen.getByText('node_selector.custom_config.submit_btn'));

      // Test if dialog is closed
      expect(screen.queryByText('node_selector.custom_config.heading'))
        .not.toBeInTheDocument();
      // Test if "Custom" is an item in the menu
      expect(screen.getByText('node_selector.custom')).toBeInTheDocument();
      // Test if button text changed: "Set custom configuration" -> "Edit custom configuration"
      expect(screen.queryByText('node_selector.custom_config.set_btn')).not.toBeInTheDocument();
      expect(screen.getByText('node_selector.custom_config.edit_btn')).toBeInTheDocument();
      // Check local storage
      expect(JSON.parse(localStorage.getItem('customNode') || '{}')).toStrictEqual({
        network: 'custom',
        nodeServer: 'https://foobar.example2.net',
        nodeToken: 'my_super_special_awesome_token',
        nodePort: 123,
        nodeHeaders: {'X-My-Header': 'hello'},
        coinName: 'COIN',
      });
    });

    it('does not set current node configuration when invalid form is submitted', async () => {
      localStorage.clear();
      render(<JotaiProvider><NodeSelector /></JotaiProvider>);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "Custom config" button
      await userEvent.click(screen.getByText('node_selector.custom_config.set_btn'));
      // Put the form in to an invalid state by not entering required fields
      await userEvent.click(screen.getByText(/node_selector.custom_config.add_header_btn/));
      // Submit
      await userEvent.click(screen.getByText('node_selector.custom_config.submit_btn'));

      expect(await screen.findByLabelText(/node_selector.view_config.url/))
        .toHaveClass('input-error');
      expect(screen.getByLabelText(/node_selector.view_config.port/))
        .not.toHaveClass('input-error');
      expect(screen.getByLabelText(/node_selector.view_config.token/))
        .not.toHaveClass('input-error');
      expect(screen.getByLabelText(/node_selector.view_config.port/))
        .not.toHaveClass('input-error');
      expect(screen.getByLabelText(/node_selector.custom_config.header_name_label/))
        .toHaveClass('input-error');
      expect(screen.getByLabelText(/node_selector.custom_config.header_value_label/))
        .not.toHaveClass('input-error');
      expect(screen.getAllByText('form.error.required')).toHaveLength(2);
      expect(screen.getByLabelText(/node_selector.view_config.coin_name/))
        .not.toHaveClass('input-error');
    });

    it('loads custom node configuration from storage', async () => {
      localStorage.setItem('customNode', JSON.stringify({
        network: 'custom',
        nodeServer: 'https://foobar5.example.com',
        nodeToken: 'HelloWorld',
        nodePort: 4000,
        nodeHeaders: {bar: 'baz qux'},
        coinName: 'COIN',
      }));
      render(<JotaiProvider><NodeSelector /></JotaiProvider>);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "Custom config" button
      await userEvent.click(screen.getByText('node_selector.custom_config.edit_btn'));

      expect(screen.getByLabelText(/node_selector.view_config.url/))
        .toHaveValue('https://foobar5.example.com');
      expect(screen.getByLabelText(/node_selector.view_config.port/)).toHaveValue('4000');
      expect(screen.getByLabelText(/node_selector.view_config.token/)).toHaveValue('HelloWorld');
      expect(screen.getByLabelText(/node_selector.custom_config.header_name_label/))
        .toHaveValue('bar');
      expect(screen.getByLabelText(/node_selector.custom_config.header_value_label/))
        .toHaveValue('baz qux');
      expect(screen.getByLabelText(/node_selector.view_config.coin_name/)).toHaveValue('COIN');
    });

    it('removes custom configuration if "clear" button is clicked', async () => {
      localStorage.setItem('customNode', JSON.stringify({
        network: 'custom',
        nodeServer: 'https://foobar5.example.com',
        nodeToken: 'HelloWorld',
        nodePort: 4000,
        nodeHeaders: {bar: 'baz qux'},
        coinName: 'COIN',
      }));
      render(
        <ToastProvider>
          <JotaiProvider><NodeSelector /></JotaiProvider>
          <ToastViewport />
        </ToastProvider>
      );

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "Custom config" button
      await userEvent.click(screen.getByText('node_selector.custom_config.edit_btn'));
      // Click "clear" button
      await userEvent.click(screen.getByText('node_selector.custom_config.clear_btn'));

      // Check for toast notification
      expect(screen.getByText('node_selector.custom_config.cleared_msg')).toBeInTheDocument();
      // Check all form fields are empty
      expect(screen.getByLabelText(/node_selector.view_config.url/)).toHaveValue('');
      expect(screen.getByLabelText(/node_selector.view_config.port/)).toHaveValue('');
      expect(screen.getByLabelText(/node_selector.view_config.token/)).toHaveValue('');
      expect(screen.queryByLabelText(/node_selector.view_config.header_name_label/))
        .not.toBeInTheDocument();
      expect(screen.getByLabelText(/node_selector.view_config.coin_name/)).toHaveValue('');
      // Check custom configuration is removed from localStorage
      expect(localStorage.getItem('customNode')).toBeNull();

      // Exit dialog
      await userEvent.click(screen.getByTitle('close'));

      // Test if "Custom" is NOT an item in the menu
      expect(screen.queryByText('node_selector.custom')).not.toBeInTheDocument();
      // Test if button text changed: "Edit custom configuration" -> "Set custom configuration"
      expect(screen.queryByText('node_selector.custom_config.edit_btn')).not.toBeInTheDocument();
      expect(screen.getByText('node_selector.custom_config.set_btn')).toBeInTheDocument();
    });

    it('shows node is online if node responds with "OK" after clicking "Test" button', async () => {
      localStorage.clear();
      render(<JotaiProvider><NodeSelector /></JotaiProvider>);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "Custom config" button
      await userEvent.click(screen.getByText('node_selector.custom_config.set_btn'));
      // Fill out enough form fields
      await userEvent.click(screen.getByLabelText(/node_selector.view_config.url/));
      await userEvent.paste('https://foobar.example2.net');
      // Click "Test" button
      await userEvent.click(screen.getByText('node_selector.custom_config.test_btn'));

      expect(await screen.findByText(/node_selector.view_config.test_pass/)).toBeInTheDocument();
    });

    it('shows node is NOT online if node does NOT respond with "OK" after clicking "Test" button',
    async () => {
      localStorage.clear();
      render(<JotaiProvider><NodeSelector /></JotaiProvider>);

      // Open menu
      await userEvent.click(screen.getByRole('button'));
      // Click "Custom config" button
      await userEvent.click(screen.getByText(/node_selector.custom_config.set_btn/));
      // Fill out enough form fields
      await userEvent.paste('testnet');
      await userEvent.click(screen.getByLabelText(/node_selector.view_config.url/));
      await userEvent.paste('https://foobar.example2.net');
      // The token set to "fail" triggers the mock node response to be an error response
      await userEvent.click(screen.getByLabelText(/node_selector.view_config.token/));
      await userEvent.paste('fail');
      // Click "Test" button
      await userEvent.click(screen.getByText('node_selector.custom_config.test_btn'));

      expect(screen.getByText(/node_selector.view_config.test_fail/)).toBeInTheDocument();
    });

  });

});
