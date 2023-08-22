type Props = {
  children?: React.ReactNode,
  /** Text for the badge above the heading. If empty, no badge will be rendered */
  badgeText?: string
}

/** Top heading for the title of a page */
export default function PageTitleHeading({ children, badgeText }: Props) {
  return (
    <div className='text-center mt-4'>
      {
        !!badgeText
        &&
        <div className='mb-2'>
          <span className='badge badge-neutral badge-lg mx-1'>{badgeText}</span>
        </div>
      }
      <h1>{children}</h1>
    </div>
  );
}
