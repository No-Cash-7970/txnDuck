import { ShowIf } from '@/app/[lang]/components';
import type { TextFieldProps } from './types';

/** Plain text form field. Includes a `<label>` element and an `<input>` element */
export default function TextField({
  required = false,
  id: inputId = '',
  inputClass = '',
  placeholder = '',
  label = '',
  inputInsideLabel = false,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  beforeSideLabel = '',
  afterSideLabel = '',
}: TextFieldProps) {
  return (
    <div className={`form-control ${containerClass}`}>
      <label className='label justify-normal' htmlFor={inputId || undefined}>
        <span className={`label-text ${inputInsideLabel? 'flex-1' : ''}`}>
          {label}
          <ShowIf cond={required}>
            <span className='text-error' title={requiredText || undefined}>*</span>
          </ShowIf>
        </span>
        <ShowIf cond={inputInsideLabel}>
          <ShowIf cond={!beforeSideLabel && !afterSideLabel}>
            <input
              className={`input-bordered input ${inputClass}`}
              type='text'
              id={inputId || undefined}
              required={required}
              placeholder={placeholder || undefined}
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
                type='text'
                id={inputId || undefined}
                required={required}
                placeholder={placeholder || undefined}
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
            type='text'
            id={inputId || undefined}
            required={required}
            placeholder={placeholder || undefined}
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
              type='text'
              id={inputId || undefined}
              required={required}
              placeholder={placeholder || undefined}
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
