type Props = {
  children?: React.ReactNode,
  /** The condition value that determines if the content is shown or not */
  cond: boolean,
}

/**
 * Show content if the given condition is true. Hide content if the given condition is false.
 */
export default function ShowIf({ children, cond }: Props) {
  return (
    <>
      {cond && children}
    </>
  );
}
