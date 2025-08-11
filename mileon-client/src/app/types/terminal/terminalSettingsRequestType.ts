export interface TerminalRequestsField {
  name: string;
  id: string;
  isDisabled: boolean;
  value: any;
  type: string; // "text" | "number" | "checkbox"
}
export interface TerminalIconsRequestsField {
  name: string;
  id: string;
  isDisabled: boolean;
  value: any;
  isParking: boolean;
  // type: string; // "text" | "number" | "checkbox"
}

export interface TerminalSettingRequest {
  settingName: string;
  displayName: string;
  value: string;
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
    | 'checkboxOptions'
    | 'password';
  isParking?: boolean;
  isDisabled?: boolean;
  id?: string;
  isRequired?: boolean;
}
export type TerminalSettingsResponse = TerminalRequestsField[];
export type TerminalIconsSettingsResponse = TerminalIconsRequestsField[];
