import FieldTip from './FieldTip';
import type { TextAreaFieldProps } from './types';

/** Text area form field. Includes a `<label>` element and a `<textarea>` element */
export default function TextAreaField({
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
  name ='',
  defaultValue = undefined,
  disabled = false,
  autoComplete = undefined, // Use browser default
  spellCheck = undefined, // Use browser default
  value = undefined,
  onChange = undefined,
  onFocus = undefined,
  onBlur = undefined,
  maxLength = undefined,
  tip = undefined,
  inputRef = undefined,
}: TextAreaFieldProps) {
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
            <textarea
              className={`textarea-bordered textarea ${inputClass}`}
              id={id || undefined}
              required={required}
              placeholder={placeholder || undefined}
              name={name || undefined}
              defaultValue={defaultValue}
              disabled={disabled}
              autoComplete={autoComplete}
              spellCheck={spellCheck}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              maxLength={maxLength}
              ref={inputRef}
            />
          }
          {// With a side label
            (beforeSideLabel || afterSideLabel) &&
            <span className='join w-full'>
              {beforeSideLabel &&
                <span className='join-item bg-base-200 flex items-center px-4'>
                  {beforeSideLabel}
                </span>
              }
              <textarea
                className={`textarea-bordered textarea join-item flex-auto ${inputClass}`}
                id={id || undefined}
                required={required}
                placeholder={placeholder || undefined}
                name={name || undefined}
                defaultValue={defaultValue}
                disabled={disabled}
                autoComplete={autoComplete}
                spellCheck={spellCheck}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                maxLength={maxLength}
                ref={inputRef}
              />
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
          <textarea
            className={`textarea-bordered textarea w-full ${inputClass}`}
            id={id || undefined}
            required={required}
            placeholder={placeholder || undefined}
            name={name || undefined}
            defaultValue={defaultValue}
            disabled={disabled}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={maxLength}
            ref={inputRef}
          />
        }
        {// With a side label
          (beforeSideLabel || afterSideLabel) &&
          <span className='join w-full'>
            {beforeSideLabel &&
              <span className='join-item bg-base-200 flex items-center px-4'>
                {beforeSideLabel}
              </span>
            }
            <textarea
              className={`textarea-bordered textarea join-item flex-auto ${inputClass}`}
              id={id || undefined}
              required={required}
              placeholder={placeholder || undefined}
              name={name || undefined}
              defaultValue={defaultValue}
              disabled={disabled}
              autoComplete={autoComplete}
              spellCheck={spellCheck}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              maxLength={maxLength}
              ref={inputRef}
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
        <div className='label help-msg'><span className='text-sm'>{helpMsg}</span></div>
      }
    </div>
  );
}
