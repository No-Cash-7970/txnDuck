import type { CheckboxFieldProps } from './types';

/** Plain text form field. Includes a `<label>` element and an `<input>` element */
export default function CheckboxField({
  required = false,
  id = '',
  inputClass = '',
  label = '',
  labelClass = '',
  labelTextClass = '',
  inputInsideLabel = true,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  defaultValue = undefined,
  inputPosition = 'start',
  name ='',
  disabled = false,
  value = undefined,
  onChange = undefined,
}: CheckboxFieldProps) {
  return (
    <div className={`form-control ${containerClass}`}>
      {(!inputInsideLabel && inputPosition === 'start') &&
        <input
          className={`checkbox ${inputClass}`}
          type='checkbox'
          id={id || undefined}
          required={required}
          defaultChecked={defaultValue}
          name={name || undefined}
          disabled={disabled}
          checked={value}
          onChange={onChange}
        />
      }
      <label className={`label ${labelClass}`} htmlFor={id || undefined}>
        {(inputInsideLabel && inputPosition === 'start') &&
          <input
            className={`checkbox ${inputClass}`}
            type='checkbox'
            id={id || undefined}
            required={required}
            defaultChecked={defaultValue}
            name={name || undefined}
            disabled={disabled}
            checked={value}
            onChange={onChange}
          />
        }
        <span className={`label-text ${labelTextClass}`}>
          {label}
          {required && <span className='text-error px-1' title={requiredText || undefined}>*</span>}
        </span>
        {(inputInsideLabel && inputPosition === 'end') &&
          <input
            className={`checkbox ${inputClass}`}
            type='checkbox'
            id={id || undefined}
            required={required}
            defaultChecked={defaultValue}
            name={name || undefined}
            disabled={disabled}
            checked={value}
            onChange={onChange}
          />
        }
      </label>
      {(!inputInsideLabel && inputPosition === 'end') &&
        <input
          className={`checkbox ${inputClass}`}
          type='checkbox'
          id={id || undefined}
          required={required}
          defaultChecked={defaultValue}
          name={name || undefined}
          disabled={disabled}
          checked={value}
          onChange={onChange}
        />
      }
      {helpMsg &&
        <div className='label help-msg'><span className='label-text-alt'>{helpMsg}</span></div>
      }
    </div>
  );
}
