import { ShowIf } from '@/app/[lang]/components';
import type { CheckboxFieldProps } from './types';

/** Plain text form field. Includes a `<label>` element and an `<input>` element */
export default function CheckboxField({
  required = false,
  id = '',
  inputClass = '',
  label = '',
  inputInsideLabel = true,
  containerClass = '',
  requiredText = '',
  helpMsg = '',
  defaultValue = undefined,
  inputPosition = 'start',
  name ='',
  disabled = false,
  value = undefined,
  onChange = undefined,
}: CheckboxFieldProps) {
  return (
    <div className={`form-control ${containerClass}`}>
      <ShowIf cond={!inputInsideLabel && inputPosition === 'start'}>
        <input
          className={`checkbox align-middle ${inputClass}`}
          type='checkbox'
          id={id || undefined}
          required={required}
          defaultChecked={defaultValue}
          name={name || undefined}
          disabled={disabled}
          checked={value}
          onChange={onChange}
        />
      </ShowIf>
      <label className='label' htmlFor={id || undefined}>
        <ShowIf cond={inputInsideLabel && inputPosition === 'start'}>
          <input
            className={`checkbox align-middle ${inputClass}`}
            type='checkbox'
            id={id || undefined}
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
            className={`checkbox align-middle ${inputClass}`}
            type='checkbox'
            id={id || undefined}
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
          className={`checkbox align-middle ${inputClass}`}
          type='checkbox'
          id={id || undefined}
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
