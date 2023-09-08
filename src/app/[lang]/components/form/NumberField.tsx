import { ShowIf } from '@/app/[lang]/components';
import type { NumberFieldProps } from './types';

/** Number form field. Includes a `<label>` element and an `<input>` element */
export default function NumberField({
  required = false,
  id: inputId = '',
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
      <label className='label justify-normal' htmlFor={inputId || undefined}>
        <span className={`label-text ${inputInsideLabel? 'flex-1' : ''}`}>
          {label}
          <ShowIf cond={required}>
            <span className='text-error px-1' title={requiredText || undefined}>*</span>
          </ShowIf>
        </span>

        <ShowIf cond={inputInsideLabel}>
          <ShowIf cond={!beforeSideLabel && !afterSideLabel}>
            <input
              className={`input-bordered input ${inputClass}`}
              type='number'
              id={inputId || undefined}
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
          </ShowIf>
          <ShowIf cond={!!beforeSideLabel || !!afterSideLabel}>
            <span className='join'>
              <ShowIf cond={!!beforeSideLabel}>
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {beforeSideLabel}
                </span>
              </ShowIf>
              <input
                className={`input-bordered input join-item ${inputClass}`}
                type='number'
                id={inputId || undefined}
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
              <ShowIf cond={!!afterSideLabel}>
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {afterSideLabel}
                </span>
              </ShowIf>
            </span>
          </ShowIf>
        </ShowIf>
      </label>

      <ShowIf cond={!inputInsideLabel}>
        <ShowIf cond={!beforeSideLabel && !afterSideLabel}>
          <input
            className={`input-bordered input ${inputClass}`}
            type='number'
            id={inputId || undefined}
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
        </ShowIf>
        <ShowIf cond={!!beforeSideLabel || !!afterSideLabel}>
          <span className='join'>
            <ShowIf cond={!!beforeSideLabel}>
              <span className='join-item bg-base-200 flex items-center px-4'>
                {beforeSideLabel}
              </span>
            </ShowIf>
            <input
              className={`input-bordered input join-item ${inputClass}`}
              type='number'
              id={inputId || undefined}
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
            <ShowIf cond={!!afterSideLabel}>
              <span className='join-item bg-base-200 flex items-center px-4'>
                {afterSideLabel}
              </span>
            </ShowIf>
          </span>
        </ShowIf>
      </ShowIf>

      <ShowIf cond={!!helpMsg}>
        <div className='label help-msg'><span className='label-text-alt'>{helpMsg}</span></div>
      </ShowIf>
    </div>
  );
}
