import type { FieldGroupProps } from './types';

export default function FieldGroup({
  children,
  heading = '',
  headingLevel = 2,
  headingClass = '',
  headingId = '',
  containerClass = '',
  disabled = false,
}: FieldGroupProps) {
  return (
    <fieldset className={containerClass || undefined} disabled={disabled}>
      {heading && <>
        {headingLevel === 1 &&
          <h1 id={headingId || undefined} className={headingClass || undefined}>{heading}</h1>
        }
        {headingLevel === 2 &&
          <h2 id={headingId || undefined} className={headingClass || undefined}>{heading}</h2>
        }
        {headingLevel === 3 &&
          <h3 id={headingId || undefined} className={headingClass || undefined}>{heading}</h3>
        }
        {headingLevel === 4 &&
          <h4 id={headingId || undefined} className={headingClass || undefined}>{heading}</h4>
        }
        {headingLevel === 5 &&
          <h5 id={headingId || undefined} className={headingClass || undefined}>{heading}</h5>
        }
        {headingLevel === 6 &&
          <h6 id={headingId || undefined} className={headingClass || undefined}>{heading}</h6>
        }
      </>}

      {children}
    </fieldset>
  );
}
