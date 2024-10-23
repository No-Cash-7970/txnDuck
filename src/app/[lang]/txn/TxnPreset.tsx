import Link from "next/link";
import { useAtom } from "jotai";
import { TFunction } from "i18next";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { txnPresetFavsAtom } from "@/app/lib/app-settings";

type Props = {
  /** Text and other elements to be used as the description */
  children?: React.ReactNode,
  /** Heading text */
  heading?: string,
  /** Text for action button */
  actionText?: string,
  /** URL for the action */
  actionURL: string,
  /** If the action is to be disabled */
  actionDisabled?: boolean,
  /** Color name used for decoration */
  color?: 'primary'|'secondary'|'accent'|'neutral',
  /** Unique identifier for the preset. Used when adding and removing preset from list of
   *  favorites
   */
  presetName: string,
  /** I18next "t" function */
  t: TFunction,
};

/** Small section containing a heading, description, and a link for a transaction preset */
export default function TxnPreset({
  children,
  heading = '',
  actionText = '',
  actionURL,
  actionDisabled = false,
  color = 'primary',
  presetName,
  t,
}: Props) {
  const [txnPresetFavs, setTxnPresetFavs] = useAtom(txnPresetFavsAtom);
  return (
    <div className={'card shadow-md border border-opacity-50'
      + (color === 'primary' ? ' border-primary' : '')
      + (color === 'secondary' ? ' border-secondary' : '')
      + (color === 'accent' ? ' border-accent' : '')
      + (color === 'neutral' ? ' border-neutral' : '')
    }>
      <div className='card-body items-center prose-code:bg-base-100 prose-code:px-0'>
        <h3 className={
          'card-title text-center mt-0'
          + (color === 'primary' ? ' text-primary' : '')
          + (color === 'secondary' ? ' text-secondary' : '')
          + (color === 'accent' ? ' text-accent' : '')
          + (color === 'neutral' ? ' text-neutral' : '')
        }>
          {heading}
        </h3>
        <p>{children}</p>
        <div className='card-actions'>
          <Link href={actionURL} prefetch={false}
            className={'btn btn-sm max-h-none max-w-full'
              + (color === 'primary' ? ' btn-primary' : '')
              + (color === 'secondary' ? ' btn-secondary' : '')
              + (color === 'accent' ? ' btn-accent' : '')
              + (color === 'neutral' ? ' btn-neutral' : '')
              + (actionDisabled? ' btn-disabled' : '')
            }
          >
            {actionText}
          </Link>
        </div>
      </div>
      {txnPresetFavs.indexOf(presetName) === -1 // If preset is not in favorites
        ? (
          <button type="button" className="btn btn-sm btn-ghost absolute top-1 end-1 px-1"
            title={t('favorites.add', {presetName: heading})}
            onClick={() => setTxnPresetFavs([...txnPresetFavs, presetName])}
          >
            <IconStar size={22} className="opacity-50" />
          </button>
        )
        : (
          <button type="button" className="btn btn-sm btn-ghost absolute top-1 end-1 px-1"
            title={t('favorites.remove', {presetName: heading})}
            onClick={() => {
              const newFavs = [...txnPresetFavs];
              newFavs.splice(newFavs.indexOf(presetName), 1); // Remove preset from favorites
              setTxnPresetFavs(newFavs);
            }}
          >
          <IconStarFilled size={22} className={
            (color === 'primary' ? 'text-primary' : '')
            + (color === 'secondary' ? 'text-secondary' : '')
            + (color === 'accent' ? 'text-accent' : '')
            + (color === 'neutral' ? 'text-neutral' : '')
          } />
          </button>
        )
      }
    </div>
  );
}
