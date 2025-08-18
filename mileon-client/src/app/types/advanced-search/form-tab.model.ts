// import { display } from 'ngx-bootstrap-icons';
export interface AdvancedForm {
  tabs: Tab[];
}

export interface Tab {
  name: string;
  displayName: string;
  rows: TabRow[];
}

export interface TabRow {
  name?: string;
  group: Field[];
}

export interface Field {
  name: string;
  displayName: string;
  type: FieldType;
  length: FieldLength;
  dataFunction?: DataFunction;
  connectedField?: string;
  multipleSelect?: boolean; // only for type select
  options?: IdValue[];
  validationPattern?: string;
  bindLabelKeys?: string[];
  disabled?: boolean;
  isRequired?: boolean;
}

export interface IdValue {
  id: number;
  value: string;
}

export interface DataFunction {
  name: string;
  extraParams?: ExtraParam[];
  objName?: string;
  function?: () => any[];
}

export interface ExtraParam {
  connectedField: string;
  paramName: string;
}

type FieldType = `${FieldTypeEnum}`; // turn enum values into type

type FieldLength = `${FieldLengthEnum}`; // turn enum values into type

export enum FieldTypeEnum {
  Checkbox = 'checkbox',
  CheckboxGroup = 'checkbox-group',
  Radio = 'radio',
  Select = 'select',
  DateTime = 'dateTime',
  Date = 'date',
  Text = 'text',
  Time = 'time',
  Phone = 'phone',
  CheckboxWithOptions = 'checkboxOptions',
  SelectWithNoLookup = 'selectNoLookup',
}

export enum FieldLengthEnum {
  Long = 'long',
  Medium = 'medium',
  Short = 'short',
}
