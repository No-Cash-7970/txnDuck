import FieldTip from './FieldTip';
import type { FileFieldProps } from './types';

/** File form field. Includes a `<label>` element and an `<input>` element */
export default function FileField({
  required = false,
  id = '',
  inputClass = '',
  label = '',
  labelClass = '',
  labelTextClass = '',
  inputInsideLabel = false,
  containerId = undefined,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  name ='',
  disabled = false,
  onChange = undefined,
  onFocus = undefined,
  onBlur = undefined,
  tip = undefined,
  accept = undefined,
  capture = undefined,
  multiple = false,
  inputRef = undefined,
}: FileFieldProps) {
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
        {inputInsideLabel &&
          <input
            className={`file-input ${inputClass}`}
            type='file'
            id={id || undefined}
            required={required}
            name={name || undefined}
            disabled={disabled}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            accept={accept}
            capture={capture}
            multiple={multiple}
            ref={inputRef}
          />
        }
      </label>
      {!inputInsideLabel &&
        <input
          className={`file-input w-full ${inputClass}`}
          type='file'
          id={id || undefined}
          required={required}
          name={name || undefined}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          accept={accept}
          capture={capture}
          multiple={multiple}
          ref={inputRef}
        />
      }

      {helpMsg &&
        <div className='label help-msg'><span className='text-sm'>{helpMsg}</span></div>
      }
    </div>
  );
}
