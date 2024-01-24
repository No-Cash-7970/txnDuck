import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  betanetNodeConfig,
  mainnetNodeConfig,
  testnetNodeConfig,
  sandboxNodeConfig
} from '@/app/lib/node-config';
import { NodeConfig } from '@txnlab/use-wallet';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock useRouter
const routerRefreshMockFn = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: routerRefreshMockFn })
}));

import NodeSelector from './NodeSelector';

describe('Node Selector', () => {

  it('displays "TestNet" button if the node configuration is set for TestNet', () => {
    sessionStorage.setItem('nodeConfig', JSON.stringify(testnetNodeConfig));
    render(<NodeSelector />);
    expect(screen.getByRole('button')).toHaveTextContent('node_selector.testnet');
  });

  it('displays "MainNet" button if the node configuration is set for MainNet', () => {
    sessionStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);
    expect(screen.getByRole('button')).toHaveTextContent('node_selector.mainnet');
  });

  it('displays "BetaNet" button if the node configuration is set for BetaNet', () => {
    sessionStorage.setItem('nodeConfig', JSON.stringify(betanetNodeConfig));
    render(<NodeSelector />);
    expect(screen.getByRole('button')).toHaveTextContent('node_selector.betanet');
  });

  it('displays "Sandbox" button if the node configuration is set for Sandbox', () => {
    sessionStorage.setItem('nodeConfig', JSON.stringify(sandboxNodeConfig));
    render(<NodeSelector />);
    expect(screen.getByRole('button')).toHaveTextContent('node_selector.sandbox');
  });

  it('sets node configuration to TestNet configuration when "TestNet" is selected', async () => {
    // Set config to something that is not TestNet
    sessionStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('node_selector.testnet'));
    const nodeConfig = JSON.parse(sessionStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('testnet');
    expect(routerRefreshMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to MainNet configuration when "MainNet" is selected', async () => {
    // Set config to something that is not MainNet
    sessionStorage.setItem('nodeConfig', JSON.stringify(testnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('node_selector.mainnet'));
    const nodeConfig = JSON.parse(sessionStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('mainnet');
    expect(routerRefreshMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to BetaNet configuration when "BetaNet" is selected', async () => {
    // Set config to something that is not BetaNet
    sessionStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('node_selector.betanet'));
    const nodeConfig = JSON.parse(sessionStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('betanet');
    expect(routerRefreshMockFn).toHaveBeenCalledTimes(1);
  });

  it('sets node configuration to Sandbox configuration when "Sandbox" is selected', async () => {
    // Set config to something that is not Sandbox
    sessionStorage.setItem('nodeConfig', JSON.stringify(mainnetNodeConfig));
    render(<NodeSelector />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('node_selector.sandbox'));
    const nodeConfig = JSON.parse(sessionStorage.getItem('nodeConfig') || '') as NodeConfig;

    expect(nodeConfig.network).toBe('sandbox');
    expect(routerRefreshMockFn).toHaveBeenCalledTimes(1);
  });

});
