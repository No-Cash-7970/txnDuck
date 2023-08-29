import { ShowIf } from '@/app/[lang]/components';
import type { SelectFieldProps } from './types';

/** Selection box form field. Includes a `<label>` element and a `<select>` element */
export default function SelectField({
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
  options = [],
  name ='',
  defaultValue = undefined,
  disabled = false,
  autoComplete = undefined, // Use browser default
}: SelectFieldProps) {
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
            <select
              className={`select-bordered select ${inputClass}`}
              id={inputId || undefined}
              required={required}
              defaultValue={defaultValue || (placeholder? '': undefined)}
              name={name || undefined}
              disabled={disabled}
              autoComplete={autoComplete}
            >
              <ShowIf cond={!!placeholder}>
                <option value='' disabled>{placeholder}</option>
              </ShowIf>
              {
                options.map((option) => {
                  return <option key={option.value} value={option.value}>{option.text}</option>;
                })
              }
            </select>
          </ShowIf>
          <ShowIf cond={!!beforeSideLabel || !!afterSideLabel}>
            <span className='join'>
              <ShowIf cond={!!beforeSideLabel}>
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {beforeSideLabel}
                </span>
              </ShowIf>
              <select
                className={`select-bordered select join-item ${inputClass}`}
                id={inputId || undefined}
                required={required}
                defaultValue={defaultValue || (placeholder? '': undefined)}
                name={name || undefined}
                disabled={disabled}
                autoComplete={autoComplete}
              >
                <ShowIf cond={!!placeholder}>
                  <option value='' disabled>{placeholder}</option>
                </ShowIf>
                {
                  options.map((option) => {
                    return <option key={option.value} value={option.value}>{option.text}</option>;
                  })
                }
              </select>
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
          <select
            className={`select-bordered select ${inputClass}`}
            id={inputId || undefined}
            required={required}
            defaultValue={defaultValue || (placeholder? '': undefined)}
            name={name || undefined}
            disabled={disabled}
            autoComplete={autoComplete}
          >
            <ShowIf cond={!!placeholder}>
              <option value='' disabled>{placeholder}</option>
            </ShowIf>
            {
              options.map((option) => {
                return <option key={option.value} value={option.value}>{option.text}</option>;
              })
            }
          </select>
        </ShowIf>
        <ShowIf cond={!!beforeSideLabel || !!afterSideLabel}>
          <span className='join'>
            <ShowIf cond={!!beforeSideLabel}>
              <span className='join-item bg-base-200 flex items-center px-4'>
                {beforeSideLabel}
              </span>
            </ShowIf>
            <select
              className={`select-bordered select join-item ${inputClass}`}
              id={inputId || undefined}
              required={required}
              defaultValue={defaultValue || (placeholder? '': undefined)}
              name={name || undefined}
              disabled={disabled}
              autoComplete={autoComplete}
            >
              <ShowIf cond={!!placeholder}>
                <option value='' disabled>{placeholder}</option>
              </ShowIf>
              {
                options.map((option) => {
                  return <option key={option.value} value={option.value}>{option.text}</option>;
                })
              }
            </select>
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
