import Link from "next/link";

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
};

export default function TxnPreset({
  children,
  heading = '',
  actionText = '',
  actionURL,
  actionDisabled = false,
  color = 'primary',
}: Props) {
  return (
    <div className={'card card-compact shadow-md shadow-base-200 border border-opacity-50'
      + (color === 'primary' ? ' border-primary' : '')
      + (color === 'secondary' ? ' border-secondary' : '')
      + (color === 'accent' ? ' border-accent' : '')
      + (color === 'neutral' ? ' border-neutral' : '')
    }>
      <div className='card-body items-center'>
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
    </div>
  );
}
