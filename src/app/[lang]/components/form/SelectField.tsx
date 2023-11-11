import type { SelectFieldProps } from './types';

/** Selection box form field. Includes a `<label>` element and a `<select>` element */
export default function SelectField({
  required = false,
  id = '',
  inputClass = '',
  placeholder = '',
  label = '',
  labelClass = '',
  labelTextClass = '',
  inputInsideLabel = false,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  beforeSideLabel = '',
  afterSideLabel = '',
  options = [],
  name ='',
  defaultValue = undefined,
  disabled = false,
  autoComplete = undefined, // Use browser default
  value = undefined,
  onChange = undefined,
}: SelectFieldProps) {
  return (
    <div className={`form-control ${containerClass}`}>
      <label className={`label ${labelClass}`} htmlFor={id || undefined}>
        <span className={`label-text ${labelTextClass}`}>
          {label}
          {required && <span className='text-error px-1' title={requiredText || undefined}>*</span>}
        </span>
        {inputInsideLabel && <>
          {(!beforeSideLabel && !afterSideLabel) &&
            <select
              className={`select-bordered select ${inputClass}`}
              id={id || undefined}
              required={required}
              defaultValue={defaultValue || ((placeholder && !value)? '': undefined)}
              name={name || undefined}
              disabled={disabled}
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
            >
              {placeholder && <option value='' disabled>{placeholder}</option>}
              {
                options.map((option) => {
                  return <option key={option.value} value={option.value}>{option.text}</option>;
                })
              }
            </select>
          }
          {(beforeSideLabel || afterSideLabel) &&
            <span className='join'>
              {beforeSideLabel &&
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {beforeSideLabel}
                </span>
              }
              <select
                className={`select-bordered select join-item ${inputClass}`}
                id={id || undefined}
                required={required}
                defaultValue={defaultValue || ((placeholder && !value)? '': undefined)}
                name={name || undefined}
                disabled={disabled}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
              >
                {placeholder && <option value='' disabled>{placeholder}</option>}
                {
                  options.map((option) => {
                    return <option key={option.value} value={option.value}>{option.text}</option>;
                  })
                }
              </select>
              {afterSideLabel &&
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {afterSideLabel}
                </span>
              }
            </span>
          }
        </>}
      </label>
      {!inputInsideLabel && <>
        {(!beforeSideLabel && !afterSideLabel) &&
          <select
            className={`select-bordered select ${inputClass}`}
            id={id || undefined}
            required={required}
            defaultValue={defaultValue || ((placeholder && !value)? '': undefined)}
            name={name || undefined}
            disabled={disabled}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
          >
            {placeholder && <option value='' disabled>{placeholder}</option>}
            {
              options.map((option) => {
                return <option key={option.value} value={option.value}>{option.text}</option>;
              })
            }
          </select>
        }
        {(beforeSideLabel || afterSideLabel) &&
          <span className='join'>
            {beforeSideLabel &&
              <span className='join-item bg-base-200 flex items-center px-4'>
                {beforeSideLabel}
              </span>
            }
            <select
              className={`select-bordered select join-item ${inputClass}`}
              id={id || undefined}
              required={required}
              defaultValue={defaultValue || ((placeholder && !value)? '': undefined)}
              name={name || undefined}
              disabled={disabled}
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
            >
              {placeholder && <option value='' disabled>{placeholder}</option>}
              {
                options.map((option) => {
                  return <option key={option.value} value={option.value}>{option.text}</option>;
                })
              }
            </select>
            {afterSideLabel &&
              <span className='join-item bg-base-200 flex items-center px-4'>
                {afterSideLabel}
              </span>
            }
          </span>
        }
      </>}

      {helpMsg &&
        <div className='label help-msg'><span className='label-text-alt'>{helpMsg}</span></div>
      }
    </div>
  );
}
