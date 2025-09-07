// Modern TypeScript interfaces with better type safety
export interface AdvancedForm {
  readonly tabs: readonly Tab[];
}

export interface Tab {
  readonly name: string;
  readonly displayName: string;
  readonly rows: readonly TabRow[];
}

export interface TabRow {
  readonly name?: string;
  readonly group: readonly Field[];
}

export interface Field {
  readonly name: string;
  readonly displayName: string;
  readonly type: FieldType;
  readonly length: FieldLength;
  readonly size?: FieldSize;
  readonly dataFunction?: DataFunction;
  readonly connectedField?: string;
  readonly multipleSelect?: boolean; // only for type select
  readonly options?: readonly IdValue[];
  readonly validationPattern?: string;
  readonly bindLabelKeys?: readonly string[];
  readonly disabled?: boolean;
  readonly isRequired?: boolean;
}

export interface IdValue {
  readonly id: number;
  readonly value: string;
}

export interface DataFunction {
  readonly name: string;
  readonly extraParams?: readonly ExtraParam[];
  readonly objName?: string;
  readonly function?: () => readonly any[];
}

export interface ExtraParam {
  readonly connectedField: string;
  readonly paramName: string;
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
  Textarea = 'textarea',
}

export enum FieldLengthEnum {
  ExtraLong = 'extraLong',
  Long = 'long',
  Medium = 'medium',
  Short = 'short',
}

export enum FieldSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extraLarge',
}
