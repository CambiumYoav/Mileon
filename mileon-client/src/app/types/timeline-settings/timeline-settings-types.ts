export type TimelineItem = {
  imgSrc?: string;
  isActive?: boolean;
  updatedCount: number;
  description?: string;
  title?: string;
  lineWidth?: string;
  path: string;
  validateFields: string[];
  errors: number;
  isUpdated: boolean;
  seen: boolean;
  // variables from server
  order: number;
  text: string;
  isMoveable: boolean;
  iconId: number;
  enumName: string;
};

export type TableConfig = {
  parking: any[];
  general: any[];
  administrative: any[];
};

export type SettingField = {
  id: string;
  name: string;
  settingsCategory: string;
  value: string | number;
  valueType: string;
};

export type SettingsFieldUpdate = {
  id: string;
  value: string;
};

export type NewSettingsFieldData = {
  section: string;
  field: string;
  currValue: string | number;
};

export type DescriptionStep = {
  step: string;
};

export type UpdatedStepData = {
  iconId: number;
  order: number;
  isEnabled: boolean;
};
