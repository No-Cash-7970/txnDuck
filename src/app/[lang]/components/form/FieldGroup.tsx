import { ShowIf } from '@/app/[lang]/components';
import type { FieldGroupProps } from './types';

export default function FieldGroup({
  children,
  heading = '',
  headingLevel = 2,
  headingClass = '',
  headingId = '',
  containerClass = '',
}: FieldGroupProps) {
  return (
    <fieldset className={containerClass || undefined}>
      <ShowIf cond={!!heading}>
        <ShowIf cond={headingLevel === 1}>
          <h1 id={headingId || undefined} className={headingClass || undefined}>{heading}</h1>
        </ShowIf>
        <ShowIf cond={headingLevel === 2}>
          <h2 id={headingId || undefined} className={headingClass || undefined}>{heading}</h2>
        </ShowIf>
        <ShowIf cond={headingLevel === 3}>
          <h3 id={headingId || undefined} className={headingClass || undefined}>{heading}</h3>
        </ShowIf>
        <ShowIf cond={headingLevel === 4}>
          <h4 id={headingId || undefined} className={headingClass || undefined}>{heading}</h4>
        </ShowIf>
        <ShowIf cond={headingLevel === 5}>
          <h5 id={headingId || undefined} className={headingClass || undefined}>{heading}</h5>
        </ShowIf>
        <ShowIf cond={headingLevel === 6}>
          <h6 id={headingId || undefined} className={headingClass || undefined}>{heading}</h6>
        </ShowIf>
      </ShowIf>

      {children}
    </fieldset>
  );
}
