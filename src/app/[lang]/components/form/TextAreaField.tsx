import { ShowIf } from '@/app/[lang]/components';
import type { TextAreaFieldProps } from './types';

/** Text area form field. Includes a `<label>` element and a `<textarea>` element */
export default function TextAreaField({
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
}: TextAreaFieldProps) {
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
            <textarea
              className={`textarea-bordered textarea ${inputClass}`}
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
              <textarea
                className={`textarea-bordered textarea join-item ${inputClass}`}
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
          <textarea
            className={`textarea-bordered textarea ${inputClass}`}
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
            <textarea
              className={`textarea-bordered textarea join-item ${inputClass}`}
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