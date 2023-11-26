import type { RadioButtonGroupFieldProps } from './types';

/** Radio button group form field */
export default function SelectField({
  required = false,
  optionClass = '',
  label = '',
  labelClass = '',
  labelTextClass = '',
  containerId = undefined,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  options = [],
  name ='',
  defaultValue = undefined,
  disabled = false,
  value = undefined,
  onChange = undefined,
  onFocus = undefined,
  onBlur = undefined,
}: RadioButtonGroupFieldProps) {
  return (
    <fieldset role='radiogroup' className={containerClass} id={containerId} disabled={disabled}>
      <legend className={`label ${labelClass}`}>
        <span className={`label-text ${labelTextClass}`}>{label}</span>
        {required && <span className='text-error px-1' title={requiredText || undefined}>*</span>}
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
                onFocus={onFocus}
                onBlur={onBlur}
                aria-label={option.text}
              />
            );
          })
        }
      </div>
      {helpMsg &&
        <p className='label help-msg mt-1 mb-0'>
          <span className='label-text-alt'>{helpMsg}</span>
        </p>
      }
    </fieldset>
  );
}
