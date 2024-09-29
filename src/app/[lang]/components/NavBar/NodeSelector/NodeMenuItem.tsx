'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSetAtom } from 'jotai';
import * as NodeConfigLib from '@/app/lib/node-config';

type Props = {
  /** The node configuration data to be applied and stored when the menu item is clicked */
  config: NodeConfigLib.NodeConfig
  /** Contents (icon & name) of the menu item */
  children: React.ReactNode
};

/** Item (network) in the node selector menu */
export default function NodeMenuItem({ config, children }: Props) {
  const router = useRouter();
  const setNodeConfig = useSetAtom(NodeConfigLib.nodeConfigAtom);
  const pathName = usePathname();
  const currentURLParams = useSearchParams();

  /** Set the node configuration to the given configuration and apply the change
   * @param newConfig The new node configuration to apply
   */
  const updateNodeConfig = (newConfig: NodeConfigLib.NodeConfig) => {
    setNodeConfig(newConfig);
    // The new node configuration isn't used unless the wallet provider is reloaded, which happens
    // when the page is refreshed. Also, remove the network specified in the URL, if present.
    const newURLParams = new URLSearchParams(currentURLParams.toString());
    newURLParams.delete(NodeConfigLib.networkURLParamName);
    router.push(pathName + (newURLParams.size ? `?${newURLParams}` : ''));
  };

  return (
    <DropdownMenu.Item asChild>
      <li className='mb-1' onClick={() => updateNodeConfig(config)}>
        <span>{children}</span>
      </li>
    </DropdownMenu.Item>
  );
}
