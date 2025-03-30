import FieldTip from './FieldTip';
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
  containerId = undefined,
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
  onFocus = undefined,
  onBlur = undefined,
  tip = undefined,
  inputRef = undefined,
}: SelectFieldProps) {
  return (
    <div className={`form-control ${containerClass}`} id={containerId}>
      <label
        className={`label ${!inputInsideLabel ? 'mb-2' : ''} text-base-content ${labelClass}`}
        htmlFor={id || undefined}
      >
        <span className={`label-text ${labelTextClass}`}>
          {label}
          {required && <span className='text-error px-1' title={requiredText || undefined}>*</span>}
          {tip && <FieldTip tipProps={tip} />}
        </span>
        {inputInsideLabel && <>
          {// Without side label
            (!beforeSideLabel && !afterSideLabel) &&
            <select
              className={`select-bordered select ${inputClass}`}
              id={id || undefined}
              required={required}
              defaultValue={defaultValue || ((placeholder && !value) ? '' : undefined)}
              name={name || undefined}
              disabled={disabled}
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              ref={inputRef}
            >
              {placeholder && <option value='' disabled>{placeholder}</option>}
              {
                options.map((option) => {
                  return <option key={option.value} value={option.value}>{option.text}</option>;
                })
              }
            </select>
          }
          {// With a side label
            (beforeSideLabel || afterSideLabel) &&
            <span className='join w-full'>
              {beforeSideLabel &&
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {beforeSideLabel}
                </span>
              }
              <select
                className={`select-bordered select join-item flex-auto ${inputClass}`}
                id={id || undefined}
                required={required}
                defaultValue={defaultValue || ((placeholder && !value) ? '' : undefined)}
                name={name || undefined}
                disabled={disabled}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                size={1}
                ref={inputRef}
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
        {// Without side label
          (!beforeSideLabel && !afterSideLabel) &&
          <select
            className={`select-bordered select w-full ${inputClass}`}
            id={id || undefined}
            required={required}
            defaultValue={defaultValue || ((placeholder && !value) ? '' : undefined)}
            name={name || undefined}
            disabled={disabled}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={inputRef}
          >
            {placeholder && <option value='' disabled>{placeholder}</option>}
            {
              options.map((option) => {
                return <option key={option.value} value={option.value}>{option.text}</option>;
              })
            }
          </select>
        }
        {// With a side label
          (beforeSideLabel || afterSideLabel) &&
          <span className='join w-full'>
            {beforeSideLabel &&
              <span className='join-item bg-base-200 flex items-center px-4'>
                {beforeSideLabel}
              </span>
            }
            <select
              className={`select-bordered select join-item flex-auto ${inputClass}`}
              id={id || undefined}
              required={required}
              defaultValue={defaultValue || ((placeholder && !value) ? '' : undefined)}
              name={name || undefined}
              disabled={disabled}
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              size={1}
              ref={inputRef}
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
        <div className='label help-msg'><span className='text-sm'>{helpMsg}</span></div>
      }
    </div>
  );
}
