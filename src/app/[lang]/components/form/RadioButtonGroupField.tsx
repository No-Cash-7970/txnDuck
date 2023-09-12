import { ShowIf } from '@/app/[lang]/components';
import type { RadioButtonGroupFieldProps } from './types';

/** Radio button group form field */
export default function SelectField({
  required = false,
  optionClass = '',
  label = '',
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  options = [],
  name ='',
  defaultValue = undefined,
  disabled = false,
  value = undefined,
  onChange = undefined,
}: RadioButtonGroupFieldProps) {
  return (
    <fieldset role='radiogroup' className={containerClass} disabled={disabled}>
      <legend className='label'>
        <span className='label-text'>{label}</span>
        <ShowIf cond={required}>
          <span className='text-error px-1' title={requiredText || undefined}>*</span>
        </ShowIf>
      </legend>
      <div className='join'>
        {
          options.map((option) => {
            return (
              <input
                type='radio'
                name={name}
                key={option.value}
                value={option.value}
                required={required}
                className={`join-item btn ${optionClass}`}
                defaultChecked={
                  (defaultValue === undefined)? undefined : (option.value === defaultValue)
                }
                checked={(value === undefined)? undefined : (option.value === value)}
                onChange={onChange}
                aria-label={option.text}
              />
            );
          })
        }
      </div>
      <ShowIf cond={!!helpMsg}>
        <p className='label help-msg mt-1 mb-0'>
          <span className='label-text-alt'>{helpMsg}</span>
        </p>
      </ShowIf>
    </fieldset>
  );
}
