import FieldTip from './FieldTip';
import type { FieldGroupProps } from './types';

/** Grouping for form fields with an optional heading. */
export default function FieldGroup({
  children,
  heading = '',
  headingLevel = 2,
  headingClass = '',
  headingId = '',
  containerId = undefined,
  containerClass = '',
  disabled = false,
  tip = undefined,
}: FieldGroupProps) {
  return (
    <fieldset className={containerClass || undefined} id={containerId} disabled={disabled}>
      {/* Putting a heading inside a legend is acceptable: "By adding a heading screen reader users
        * can navigate to the heading and the legend text is also included as part of navigable
        * document structure."
        * Source: https://www.tpgi.com/fieldsets-legends-and-screen-readers-again/
        */}
      {heading && <legend>
        {headingLevel === 1 &&
          <h1 id={headingId || undefined} className={headingClass || undefined}>
            {heading}
            {tip && <FieldTip tipProps={tip} />}
          </h1>
        }
        {headingLevel === 2 &&
          <h2 id={headingId || undefined} className={headingClass || undefined}>
            {heading}
            {tip && <FieldTip tipProps={tip} />}
          </h2>
        }
        {headingLevel === 3 &&
          <h3 id={headingId || undefined} className={headingClass || undefined}>
            {heading}
            {tip && <FieldTip tipProps={tip} />}
          </h3>
        }
        {headingLevel === 4 &&
          <h4 id={headingId || undefined} className={headingClass || undefined}>
            {heading}
            {tip && <FieldTip tipProps={tip} />}
          </h4>
        }
        {headingLevel === 5 &&
          <h5 id={headingId || undefined} className={headingClass || undefined}>
            {heading}
            {tip && <FieldTip tipProps={tip} />}
          </h5>
        }
        {headingLevel === 6 &&
          <h6 id={headingId || undefined} className={headingClass || undefined}>
            {heading}
            {tip && <FieldTip tipProps={tip} />}
          </h6>
        }
      </legend>}

      {children}
    </fieldset>
  );
}
