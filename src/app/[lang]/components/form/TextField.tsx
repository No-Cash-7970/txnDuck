import FieldTip from './FieldTip';
import type { TextFieldProps } from './types';

/** Plain text form field. Includes a `<label>` element and an `<input>` element */
export default function TextField({
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
  inputMode = undefined,
  type = undefined,
  maxLength = undefined,
  tip = undefined,
  inputRef = undefined,
}: TextFieldProps) {
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
            <input
              className={`input ${inputClass}`}
              type={type ?? 'text'}
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
              inputMode={inputMode}
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
              <input
                className={`input join-item flex-auto ${inputClass}`}
                type={type ?? 'text'}
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
                inputMode={inputMode}
                maxLength={maxLength}
                size={1}
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
          <input
            className={`input w-full ${inputClass}`}
            type={type ?? 'text'}
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
            inputMode={inputMode}
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
            <input
              className={`input join-item flex-auto ${inputClass}`}
              type={type ?? 'text'}
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
              inputMode={inputMode}
              maxLength={maxLength}
              size={1}
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
