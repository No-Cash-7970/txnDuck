import { WalletProvider } from "@/app/[lang]/components";
import { isWalletConnectedAtom } from "@/app/lib/wallet-utils";
import { type TFunction } from "i18next";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import ConnectWallet from "./ConnectWallet";

/** Component that handles the "connect wallet" button below certain form fields */
export default function ConnectWalletFieldWidget({ t, setvalfn }:{
  t: TFunction,
  setvalfn: (v: any) => void,
}) {
  const isWalletConnected = useAtomValue(isWalletConnectedAtom);

  // Trigger rerender when wallet connection status has changed
  useEffect(() => {}, [isWalletConnected]);

  return (
    <WalletProvider sitename={t('site_name')}>
      <ConnectWallet t={t} setvalfn={setvalfn} />
    </WalletProvider>
  );
}
