/** General properties for the `<input>` elements in *Field components */
interface InputProps {
  /** If the field is required to be non-empty */
  required?: boolean;
  /** `id` attribute that is assigned to the `<input>` element */
  id?: string;
  /** Classes to add to the `<input>` element for the field */
  inputClass?: string;
}

/** General properties for fields */
interface FieldProps {
  /** Text for the main label */
  label?: string;
  /** If the `<input>` element should be inside in the `<label>` element */
  inputInsideLabel?: boolean;
  /** Classes to add to the container element for the field */
  containerClass?: string;
  /**
   * Text for the `title` attribute of the asterisk shown when the field is required.
   * Example: "Required"
   */
  requiredText?: string;
  /** Text for the helper message that is placed below `<input>` element */
  helpMsg?: string;
}

/** Properties for *Fields that have side-labels */
interface SideLabelProp {
  /**
   * A side-label attached to the left side (right side in right-to-left languages) of the <input>
   * element
   */
  beforeSideLabel?: string;
  /**
   * A side-label attached to the right side (left side in right-to-left languages) of the <input>
   * element
   */
  afterSideLabel?: string;
}

/** Properties for the TextField component */
export interface TextFieldProps extends InputProps, FieldProps, SideLabelProp {
  /** Placeholder text for the `<input>` element */
  placeholder?: string;
}

/** Properties for the NumberField component */
export interface NumberFieldProps extends InputProps, FieldProps, SideLabelProp {
  /** Minimum value allowed */
  min?: number | null;
  /** Maximum value allowed */
  max?: number | null;
  /** Specifies the granularity that the value must adhere to */
  step?: number | 'any' | null;
}
