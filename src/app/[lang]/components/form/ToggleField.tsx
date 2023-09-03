import { ShowIf } from '@/app/[lang]/components';
import type { ToggleFieldProps } from './types';

/** Plain text form field. Includes a `<label>` element and an `<input>` element */
export default function ToggleField({
  required = false,
  id: inputId = '',
  inputClass = '',
  label = '',
  inputInsideLabel = true,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  defaultValue = undefined,
  inputPosition = 'end',
  name ='',
  disabled = false,
  value = undefined,
  onChange = undefined,
}: ToggleFieldProps) {
  return (
    <div className={`form-control ${containerClass}`}>
      <ShowIf cond={!inputInsideLabel && inputPosition === 'start'}>
        <input
          className={`toggle ${inputClass}`}
          type='checkbox'
          id={inputId || undefined}
          required={required}
          defaultChecked={defaultValue}
          name={name || undefined}
          disabled={disabled}
          checked={value}
          onChange={onChange}
        />
      </ShowIf>
      <label className='label justify-normal' htmlFor={inputId || undefined}>
        <ShowIf cond={inputInsideLabel && inputPosition === 'start'}>
          <input
            className={`toggle ${inputClass}`}
            type='checkbox'
            id={inputId || undefined}
            required={required}
            defaultChecked={defaultValue}
            name={name || undefined}
            disabled={disabled}
            checked={value}
            onChange={onChange}
          />
        </ShowIf>
        <span className={`label-text align-middle ${inputInsideLabel? 'flex-1' : ''}`}>
          {label}
          <ShowIf cond={required}>
            <span className='text-error px-1' title={requiredText || undefined}>*</span>
          </ShowIf>
        </span>
        <ShowIf cond={inputInsideLabel && inputPosition === 'end'}>
          <input
            className={`toggle ${inputClass}`}
            type='checkbox'
            id={inputId || undefined}
            required={required}
            defaultChecked={defaultValue}
            name={name || undefined}
            disabled={disabled}
            checked={value}
            onChange={onChange}
          />
        </ShowIf>
      </label>
      <ShowIf cond={!inputInsideLabel && inputPosition === 'end'}>
        <input
          className={`toggle ${inputClass}`}
          type='checkbox'
          id={inputId || undefined}
          required={required}
          defaultChecked={defaultValue}
          name={name || undefined}
          disabled={disabled}
          checked={value}
          onChange={onChange}
        />
      </ShowIf>
      <ShowIf cond={!!helpMsg}>
        <div className='label help-msg'><span className='label-text-alt'>{helpMsg}</span></div>
      </ShowIf>
    </div>
  );
}
