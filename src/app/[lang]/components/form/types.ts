/** General properties for the form inputs in *Field components */
interface InputProps {
  /** If the field is required to be non-empty */
  required?: boolean;
  /** `id` attribute that is assigned to the input element */
  id?: string;
  /** Classes to add to the input element for the field */
  inputClass?: string;
  /** Data key for the input */
  name?: string;
  /** Default value of the input */
  defaultValue?: string | number | boolean;
  /** If the input is disabled */
  disabled?: boolean;
}

/** General properties for fields */
interface FieldProps {
  /** Text for the main label */
  label?: string;
  /**
   * If the input should be inside in the label. If set to `false`, the `id` for the input needs to
   * be set for the label to function properly
   */
  inputInsideLabel?: boolean;
  /** Classes to add to the container for the field */
  containerClass?: string;
  /**
   * Text for the `title` attribute of the asterisk shown when the field is required.
   * Example: "Required"
   */
  requiredText?: string;
  /** Text for the helper message that is placed below input */
  helpMsg?: string;
}

/** Properties for *Fields that have side-labels */
interface SideLabelProp {
  /**
   * A side-label attached to the left side (right side in right-to-left languages) of the input
   */
  beforeSideLabel?: string;
  /**
   * A side-label attached to the right side (left side in right-to-left languages) of the input
   */
  afterSideLabel?: string;
}

/** Properties for the TextField component */
export interface TextFieldProps extends InputProps, FieldProps, SideLabelProp {
  /** Default value of the input */
  defaultValue?: string | number;
  /** Placeholder text for the input */
  placeholder?: string;
  /**
   * Type of auto-complete. Set to 'off' to turn off auto-complete.
   *
   * More information:
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values
   */
  autoComplete?: string;
  /** If spell-check should be enabled */
  spellCheck?: boolean;
}

/** Properties for the NumberField component */
export interface NumberFieldProps extends InputProps, FieldProps, SideLabelProp {
  defaultValue?: number;
  /** Minimum value allowed */
  min?: number | null;
  /** Maximum value allowed */
  max?: number | null;
  /** Specifies the granularity that the value must adhere to */
  step?: number | 'any' | null;
  /**
   * Type of auto-complete. Set to 'off' to turn off auto-complete.
   *
   * More information:
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values
   */
  autoComplete?: string;
}

/** Properties for the SelectField component */
export interface SelectFieldProps extends Omit<TextFieldProps, 'spellcheck'> {
  /** List of options available to select. The `value` of each option should be unique */
  options?: {
    /** Value of the option */
    value: string,
    /** Display text for the option */
    text: string
  }[];
}

/** Properties for the TextAreaField component */
export interface TextAreaFieldProps extends TextFieldProps {}

/** Properties for the CheckboxField component */
export interface CheckboxFieldProps extends InputProps, FieldProps {
  /** If the field should be checked by default */
  defaultValue?: boolean;
  /**
   * The position of the input relative to the label.
   *
   * `start` = input positioned before the label
   *
   * `end` = input positioned after the label
   */
  inputPosition?: 'start' | 'end';
}

/** Properties for the ToggleField component */
export interface ToggleFieldProps extends CheckboxFieldProps {}

/** Properties for the FieldGroup component */
export interface FieldGroupProps {
  /** Fields and other things inside the group */
  children?: React.ReactNode;
  /** Text of the heading */
  heading?: string;
  /** The level of the heading. Ranges from `1` (an `<h1>` heading) to `6` (an `<h6>`) */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 ;
  /** Classes to add to the heading */
  headingClass?: string;
  /** The `id` for the heading */
  headingId?: string;
  /** Classes to add to the container for the field group */
  containerClass?: string;
  /** If all inputs contained within the group should be disabled */
  disabled?: boolean;
}
