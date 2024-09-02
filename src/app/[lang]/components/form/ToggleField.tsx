import FieldTip from './FieldTip';
import type { ToggleFieldProps } from './types';

/** Plain text form field. Includes a `<label>` element and an `<input>` element */
export default function ToggleField({
  required = false,
  id = '',
  inputClass = '',
  label = '',
  labelClass = '',
  labelTextClass = '',
  inputInsideLabel = true,
  containerId = undefined,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  defaultValue = undefined,
  inputPosition = 'end',
  name ='',
  disabled = false,
  value = undefined,
  onChange = undefined,
  onFocus = undefined,
  onBlur = undefined,
  tip = undefined,
  inputRef = undefined,
}: ToggleFieldProps) {
  return (
    <div className={`form-control ${containerClass}`} id={containerId}>
      {(!inputInsideLabel && inputPosition === 'start') &&
        <input
          className={`toggle ${inputClass}`}
          type='checkbox'
          id={id || undefined}
          required={required}
          defaultChecked={defaultValue}
          name={name || undefined}
          disabled={disabled}
          checked={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
        />
      }
      <label className={`label ${labelClass}`} htmlFor={id || undefined}>
        {(inputInsideLabel && inputPosition === 'start') &&
          <input
            className={`toggle ${inputClass}`}
            type='checkbox'
            id={id || undefined}
            required={required}
            defaultChecked={defaultValue}
            name={name || undefined}
            disabled={disabled}
            checked={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={inputRef}
          />
        }
        <span className={`label-text ${labelTextClass}`}>
          {label}
          {required && <span className='text-error px-1' title={requiredText || undefined}>*</span>}
          {tip && <FieldTip tipProps={tip} />}
        </span>
        {(inputInsideLabel && inputPosition === 'end') &&
          <input
            className={`toggle ${inputClass}`}
            type='checkbox'
            id={id || undefined}
            required={required}
            defaultChecked={defaultValue}
            name={name || undefined}
            disabled={disabled}
            checked={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={inputRef}
          />
        }
      </label>
      {(!inputInsideLabel && inputPosition === 'end') &&
        <input
          className={`toggle ${inputClass}`}
          type='checkbox'
          id={id || undefined}
          required={required}
          defaultChecked={defaultValue}
          name={name || undefined}
          disabled={disabled}
          checked={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
        />
      }

      {helpMsg &&
        <div className='label help-msg'><span className='label-text-alt'>{helpMsg}</span></div>
      }
    </div>
  );
}
