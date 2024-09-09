import { Suspense } from "react";
import { TxnPresetBadge } from "./TxnPresetBadge";

type Props = {
  children?: React.ReactNode,
  /** Language (Not needed if `showTxnPreset` is `false`) */
  lng?: string,
  /**  If a badge for the transaction preset should be shown. Only used by a few pages. */
  showTxnPreset?: boolean
}

/** Top heading for the title of a page */
export default function PageTitleHeading({ children, lng = '', showTxnPreset = false }: Props) {
  return (
    <div className='text-center mt-4'>
      {showTxnPreset && <div className='mb-2'>
        <Suspense><TxnPresetBadge lng={lng} /></Suspense>
      </div>}
      <h1 className="text-3xl sm:text-4xl">{children}</h1>
    </div>
  );
}
