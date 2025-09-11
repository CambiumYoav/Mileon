import { Validators } from '@angular/forms';
import {
  Field,
  FieldTypeEnum,
  FieldLengthEnum,
} from '../advanced-search/form-tab.model';
export class TicketChartForm {
  inspectorId: string;
  authorityId: string;
  constructor(args: TicketChartForm) {
    this.authorityId = args.authorityId;
    this.inspectorId = args.inspectorId;
  }
}
export class TicketsPieChartForm extends TicketChartForm {
  mode: string;
  day?: Date;
  fromDate?: Date;
  toDate?: Date;
  year?: string;
  constructor(args: TicketsPieChartForm) {
    super(args);
    this.mode = args.mode;
    this.day = args.day;
    this.fromDate = args.fromDate;
    this.toDate = args.toDate;
    this.year = args.year;
  }
}
export class TicketsBarChartForm extends TicketsPieChartForm {
  ticketTypeId: number;
  constructor(args: TicketsBarChartForm) {
    super(args);
    this.ticketTypeId = args.ticketTypeId;
  }
}
export class TicketsLineChartForm extends TicketChartForm {
  ticketTypeId: number;
  constructor(args: TicketsLineChartForm) {
    super(args);
    this.ticketTypeId = args.ticketTypeId;
  }
}
export class TicketsTableChartForm extends TicketsPieChartForm {
  ticketTypeId: number;
  areaId?: number;
  streetId?: number;
  constructor(args: TicketsTableChartForm) {
    super(args);
    this.ticketTypeId = args.ticketTypeId;
    this.areaId = args.areaId;
    this.streetId = args.streetId;
  }
}

export const chartsValidation = {
  inspectorId: [Validators.required],
  mode: [Validators.required],
  ticketTypeId: [Validators.required],
};
export class InspectorsForm {
  inspectorsIds: number[];
  ticketTypes: number[];
  authorityId: string;
  constructor(data?: Partial<InspectorsForm>) {
    this.inspectorsIds = data?.inspectorsIds ?? [];
    this.authorityId = '';
    this.ticketTypes = data?.ticketTypes ?? [0];
  }
}

export class InspectorForm {
  ticketTypes: number[];
  constructor(data?: Partial<InspectorForm>) {
    this.ticketTypes = data?.ticketTypes ?? [0];
  }
}

export const ticketsPieChartFields: Field[] = [
  {
    name: 'inspectorId',
    displayName: 'בחירת פקח ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    dataFunction: {
      name: 'getInspectors',
      extraParams: [
        {
          connectedField: 'authorityId',
          paramName: 'authorityId',
        },
      ],
    },
  },
  {
    name: 'mode',
    displayName: 'טווחים',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    options: [
      { id: 0, value: 'יומי' },
      { id: 1, value: 'טווח תאריכים' },
      { id: 2, value: 'שנתי' },
    ],
  },
];
export const ticketsLineChartFields: Field[] = [
  {
    name: 'ticketTypeId',
    displayName: 'סיווג דוח ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    dataFunction: {
      name: 'getTicketLookups',
      objName: 'ticketTypes',
    },
  },
  {
    name: 'inspectorId',
    displayName: 'בחירת פקח ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    dataFunction: {
      name: 'getInspectors',
      extraParams: [
        {
          connectedField: 'authorityId',
          paramName: 'authorityId',
        },
      ],
    },
  },
];
export const BarChartFields: Field[] = [
  {
    name: 'ticketTypeId',
    displayName: 'סיווג דוח ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    dataFunction: {
      name: 'getTicketLookups',
      objName: 'ticketTypes',
    },
  },
  {
    name: 'inspectorId',
    displayName: 'בחירת פקח ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    dataFunction: {
      name: 'getInspectors',
      extraParams: [
        {
          connectedField: 'authorityId',
          paramName: 'authorityId',
        },
      ],
    },
  },
  {
    name: 'mode',
    displayName: 'טווחים',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    options: [
      { id: 0, value: 'יומי' },
      { id: 1, value: 'טווח תאריכים' },
      { id: 2, value: 'שנתי' },
    ],
  },
];

export const InspectorsTableChartFields: Field[] = [
  {
    name: 'ticketTypeId',
    displayName: 'סיווג דוח ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    options: [
      {
        id: 1,
        value: 'מנהלי',
      },
      {
        id: 2,
        value: 'חניה',
      },
      {
        id: 3,
        value: 'כללי',
      },
     
    ],

  },
  {
    name: 'areaId',
    displayName: 'אזור ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: false,
    dataFunction: {
      name: 'getAreas',
      extraParams: [
        {
          connectedField: 'authorityId',
          paramName: 'authorityIDs',
        },
      ],
    },
  },
  {
    name: 'streetId',
    displayName: 'רחוב ',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: false,
    dataFunction: {
      name: 'getStreets',
      extraParams: [
        {
          connectedField: 'areaId',
          paramName: 'areaIDs',
        },
        {
          connectedField: 'authorityId',
          paramName: 'authorityIDs',
        },
      ],
    },
  },
  {
    name: 'mode',
    displayName: 'טווחים',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    options: [
      { id: 0, value: 'יומי' },
      { id: 1, value: 'טווח תאריכים' },
      { id: 2, value: 'שנתי' },
    ],
  },
];

export const inspectorFilterFields: Field[] = [
  {
    type: FieldTypeEnum.Select,
    name: 'inspectorsIds',
    displayName: 'פקחים',

    dataFunction: {
      name: 'getInspectors',
      extraParams: [
        {
          connectedField: 'authorityId',
          paramName: 'authorityID',
        },
      ],
    },

    length: FieldLengthEnum.Long,
    isRequired: true,
    multipleSelect: true,
  },
  {
    type: FieldTypeEnum.SelectWithNoLookup,
    name: 'ticketTypes',
    displayName: 'סוג דוח',

    // dataFunction: {
    //   name: 'getTicketLookups',
    //   objName: 'ticketTypes',
    // },
    options: [
      {
        id: 0,
        value: 'הכל',
      },
      {
        id: 1,
        value: 'מנהלי',
      },
      {
        id: 2,
        value: 'חניה',
      },
      {
        id: 3,
        value: 'כללי',
      },
      // {
      //   id: 4,
      //   value: 'אכיפה',
      // },
    ],

    length: FieldLengthEnum.Long,
    isRequired: true,
    multipleSelect: true,
  },
  {
    type: FieldTypeEnum.Text,
    displayName: 'פקח',
    name: 'authorityId',
    length: FieldLengthEnum.Long,
    isRequired: false,
  },
];

export const inspectorDailyFilterFields: Field[] = [
  {
    type: FieldTypeEnum.SelectWithNoLookup,
    name: 'ticketTypes',
    displayName: 'סוג דוח',

    options: [
      {
        id: 0,
        value: 'הכל',
      },
      {
        id: 1,
        value: 'מנהלי',
      },
      {
        id: 2,
        value: 'חניה',
      },
      {
        id: 3,
        value: 'כללי',
      },
      // {
      //   id: 4,
      //   value: 'אכיפה',
      // },
    ],

    length: FieldLengthEnum.Long,
    isRequired: true,
    multipleSelect: true,
  },
];
