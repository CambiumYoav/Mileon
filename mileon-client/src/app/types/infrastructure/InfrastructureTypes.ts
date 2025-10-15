import { DataFunction } from '../advanced-search/form-tab.model';
import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';

export interface InfrastructureTableConfig {
  headers: string[];
  cells: cellConfig[];
}

type cellConfig = {
  field: string;
  type: string;
  isColorDisplay: boolean;
  isEditable: boolean;
};

export interface DynamicRow {
  row: DynamicField[];
}

export interface FieldOption {
  value: any;
  display: string;
}

export interface FromToOptions {
  name: string;
  placeholder: string;
  value: string;
}
export interface DynamicField {
  name: string; // The form control name
  type:
    | 'text'
    | 'checkbox'
    | 'radio'
    | 'number'
    | 'select'
    | 'fromTo'
    | 'date'
    | 'selectWithLookup'
    | 'texts'
    | 'file'
    | 'time'
    | 'phone'
    | 'checkboxOptions'
    | 'password'
    | 'url'
    | 'text-area'
    | 'image'
    | 'details'; // The input type
  label: string; // Label for the field
  value?: any; // Default value
  disabled?: boolean;
  options?: FieldOption[]; // Options for radio or select inputs
  hide: boolean;
  size: DynamicFieldSize;
  fields?: FromToOptions[];
  isMultiSelect?: boolean;
  validations?: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    min?: number;
    max?: number;
  };
  dataFunction?: DataFunction;
  connectedField?: string;
  bindLabelKeys?: string[];
  bindLabelKey?: string;
  bindValueKey?: string;
  nestedInputs?: DynamicField[];
  placeholder?: string;
  isRequired?: boolean;
  order?: number;
}

export interface SpecialTableTypes {
  value: string;
  display: string;
}
