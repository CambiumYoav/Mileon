import {
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';
import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import {
  DynamicField,
  DynamicRow,
} from '../infrastructure/InfrastructureTypes';

//remove this
export const authorityFields: Field[] = [
  {
    name: 'authorityName',
    displayName: 'רשות',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    disabled: true,
  },
  {
    name: 'logoUrl',
    displayName: 'לוגו',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'phone',
    displayName: 'טלפון',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'email',
    displayName: 'מייל',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'portalSubDomain',
    displayName: 'דומיין',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'cityName', //authorityName?
    displayName: 'עיר',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    disabled: true,
  },
  {
    name: 'streetID',
    displayName: 'רחוב',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getStreets',
      extraParams: [
        {
          connectedField: 'cityID',
          paramName: 'cityIDs',
        },
      ],
    },
    options: [],
  },
  {
    name: 'houseNumber',
    displayName: 'מספר בית',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
];

export class AuthorityForm {
  //remove this
  public createAuthorityFields: DynamicField[] = [
    {
      name: 'authorityName',
      label: 'שם הרשות',
      type: 'text',
      size: DynamicFieldSize.Regular,
      hide: false,
    },
    {
      name: 'logoUrl',
      label: 'מספר שע"מ ',
      type: 'text',
      size: DynamicFieldSize.Regular,
      hide: false,
    },
    {
      name: 'phone',
      label: 'טלפון',
      type: 'text',
      size: DynamicFieldSize.Regular,
      hide: false,
    },
    {
      name: 'portalSubDomain',
      label: 'פקס',
      type: 'text',
      size: DynamicFieldSize.Regular,
      hide: false,
    },
    {
      name: 'email',
      label: 'דואר אלקטורני',
      type: 'text',
      size: DynamicFieldSize.Regular,
      hide: false,
    },
  ];
  //FIXME -  update server names
  public AuthorityFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'authorityName',
          label: 'שם הרשות',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,

            pattern: /^[\u0590-\u05FFa-zA-Z\s\-]+$/,
          },
        },
        {
          name: 'shaamNumber',
          label: 'מספר שע"מ ',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            pattern: /^[0-9]{6,14}$/,
          },
        },
        {
          name: 'phone',
          label: 'טלפון',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            pattern: /^0[2-9]\d{7,8}$/,
          },
        },
        {
          name: 'faxNumber',
          label: 'פקס',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          validations: {
            required: false,
            pattern: /^(0[2-9]|972[2-9]|\+972[2-9])[0-9]{7,8}$/,
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'email',
          label: 'דואר אלקטרוני',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          },
        },

        {
          name: 'authorityID',
          label: 'דואר אלקטרוני',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          isRequired: true,
        },
        {
          name: 'isCreated',
          label: 'דואר אלקטרוני',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          isRequired: true,
        },
      ],
    },
  ];

  public CustomerAuthorityFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'contractStartDate',
          label: 'תאריך התחלת התקשרות',
          type: 'date',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
          },
          //add validation
        },
        {
          name: 'contractEndDate',
          label: ' תאריך סיום התקשרות',
          type: 'date',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
        },
        {
          name: 'extensionOptionYears',
          label: 'אופציה להארכה',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          validations: {
            required: false,
            pattern: /^[1-9][0-9]*$/,
            // maxLength: 10,
            // max: 10,
          },
        },
        {
          name: 'customerManagerName',
          label: 'שם מנהל לקוח',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            pattern: /^[\u0590-\u05FFa-zA-Z\s\-]+$/,
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'customerManagerEmail',
          label: 'דוא"ל מנהל לקוח',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          },
        },
        {
          name: 'guaranteeAmount',
          label: '  סכום ערבות',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          validations: {
            required: false,
            pattern: /^(0\.\d+|[1-9]\d*(\.\d+)?)$/,
          },
        },
        {
          name: 'guaranteeValidityDate',
          label: '  תוקף ערבות',
          type: 'date',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
        },
        {
          name: 'ID',
          label: 'תוקף ערבות',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          isRequired: false,
        },
        {
          name: 'authorityID',
          label: '  תוקף ערבות',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          isRequired: false,
        },
      ],
    },
  ];

  public PortalAuthorityFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'url',
          label: 'לינק לאתר של הרשות',
          type: 'url',
          size: DynamicFieldSize.Medium,
          hide: false,
          value: 'https://',
          isRequired: true,
          validations: {
            required: true,
            // pattern: /^[a-zA-Z0-9-]+$/,
          },
          placeholder: 'https://',
        },
      ],
    },
  ];
}
