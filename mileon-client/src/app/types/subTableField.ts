export interface SubTableField {
  label: string;
  key: string;
  type: string;
  value: string | number | boolean;
  isDisabled?: boolean;
  options?: { label: string; value: any }[];
}

export interface SubTable {
  key: string;
  category: string;
  fields: SubTableField[];
  extraColName?: string;
  tableTitle?: string;
}
