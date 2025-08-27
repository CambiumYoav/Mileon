export class Table {
  columns: Column[] = [];
  rows: any[] = [];

  addColumn(column: Column) {
    this.columns = [...this.columns, column];
  }
}

export class Column {
  /** List of options */
  displayName!: string;
  propertyName!: string;
  sortField?: string;
  fieldId?: any;
  canSort!: boolean;
  type!: ColumnType;
  sortByServer!: boolean;
  hasIcon?: boolean;
  additionalText?: string;
  textOverflow?: boolean;
  textColor?: string;
  icon?: string;
  hasCheckbox?: boolean;
  constructor(options: Partial<Column> = {}) {
    this.displayName = options.displayName || '';
    this.sortField = options.sortField || '';
    this.fieldId = options.fieldId || '';
    this.canSort = options.canSort || false;
    this.type = options.type || 'text';
  }
}

type ColumnType = `${ColumnTypeEnum}`; // turn enum values into type

export enum ColumnTypeEnum {
  Hidden = 'hidden',
  Checkbox = 'checkbox',
  Text = 'text',
  Tag = 'tag',
  Currency = 'currency',
  Date = 'date',
  Radio = 'radio',
  DateTime = 'dateTime',
  Active = 'active',
  Icon = 'icon',
  Number = 'number',
  Dropdown = 'dll',
  SubStageIcon = 'subStageIcon',
  ActiveStatus= 'activeStatus',
  Select='select',
  Input = 'input'
}

// export class Row {
//   /** List of options */
//   key: string;
//   value: any;

//   constructor(options: Partial<Row> = {}) {
//     this.key = options.key || '';
//     this.value = options.value;
//   }
// }
