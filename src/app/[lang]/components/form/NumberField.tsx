import type { NumberFieldProps } from './types';

/** Number form field. Includes a `<label>` element and an `<input>` element */
export default function NumberField({
  required = false,
  id = '',
  inputClass = '',
  label = '',
  inputInsideLabel = false,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  min = null,
  max = null,
  step = null,
  beforeSideLabel = '',
  afterSideLabel = '',
  name ='',
  defaultValue = undefined,
  disabled = false,
  autoComplete = undefined, // Use browser default
  value = undefined,
  onChange = undefined,
}: NumberFieldProps) {
  return (
    <div className={`form-control ${containerClass}`}>
      <label className='label' htmlFor={id || undefined}>
        <span className={`label-text ${inputInsideLabel? 'flex-1' : ''}`}>
          {label}
          {required && <span className='text-error px-1' title={requiredText || undefined}>*</span>}
        </span>

        {inputInsideLabel && <>
          {(!beforeSideLabel && !afterSideLabel) &&
            <input
              className={`input-bordered input ${inputClass}`}
              type='number'
              id={id || undefined}
              required={required}
              min={min !== null? min : undefined }
              max={max !== null? max : undefined }
              step={step !== null? step : undefined }
              name={name || undefined}
              defaultValue={defaultValue}
              disabled={disabled}
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
            />
          }
          {(beforeSideLabel || afterSideLabel) && <>
            <span className='join'>
              {beforeSideLabel &&
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {beforeSideLabel}
                </span>
              }
              <input
                className={`input-bordered input join-item ${inputClass}`}
                type='number'
                id={id || undefined}
                required={required}
                min={min !== null? min : undefined }
                max={max !== null? max : undefined }
                step={step !== null? step : undefined }
                name={name || undefined}
                defaultValue={defaultValue}
                disabled={disabled}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
              />
              {afterSideLabel &&
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {afterSideLabel}
                </span>
              }
            </span>
          </>}
        </>}
      </label>

      {!inputInsideLabel && <>
        {(!beforeSideLabel && !afterSideLabel) &&
          <input
            className={`input-bordered input ${inputClass}`}
            type='number'
            id={id || undefined}
            required={required}
            min={min !== null? min : undefined }
            max={max !== null? max : undefined }
            step={step !== null? step : undefined }
            name={name || undefined}
            defaultValue={defaultValue}
            disabled={disabled}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
          />
        }
        {(beforeSideLabel || afterSideLabel) &&
          <span className='join'>
            {beforeSideLabel &&
              <span className='join-item bg-base-200 flex items-center px-4'>
                {beforeSideLabel}
              </span>
            }
            <input
              className={`input-bordered input join-item ${inputClass}`}
              type='number'
              id={id || undefined}
              required={required}
              min={min !== null? min : undefined }
              max={max !== null? max : undefined }
              step={step !== null? step : undefined }
              name={name || undefined}
              defaultValue={defaultValue}
              disabled={disabled}
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
            />
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
