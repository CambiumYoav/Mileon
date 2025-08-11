import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicRow } from '../infrastructure/InfrastructureTypes';

export class DraftsAndLettersForms {
  public DetailsForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'id',
          type: 'text',
          label: 'קוד',
          value: 0,
          validations: {},
          disabled: true,
          hide: false,
          isRequired: true,
          size: DynamicFieldSize.Medium,
        },
        {
          name: 'name',
          type: 'text',
          label: 'שם המכתב',
          validations: {
            required: true,
            maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
        },
        {
          name: 'smsDisplayName',
          type: 'selectWithLookup',
          label: ' כותרת להודעה sms',
          validations: {
            // required: true,
            maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'draftsAndLettersTicketTypes',
          type: 'checkboxOptions',
          label: 'סיווג דוח ',
          value: '',
          validations: {},
          disabled: false,
          hide: false,
          isRequired: true,
          size: DynamicFieldSize.Medium,
        },
        {
          name: 'isIndictment',
          type: 'checkbox',
          label: 'כתב אישום',
          value: false,
          validations: {
            // required: true,
            // maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
          options: [{ value: true, display: 'כתב אישום' }],
        },
        {
          name: 'emailDisplayName',
          type: 'selectWithLookup',
          label: 'כותרת להודעה דוא"ל',
          validations: {
            // required: true,
            // maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
        },

        {
          name: 'authorityID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'draftsAndLettersTypeId',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];
  public DraftDetailsForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'id',
          type: 'text',
          label: 'קוד',
          value: 0,
          validations: {},
          disabled: true,
          hide: false,
          isRequired: true,
          size: DynamicFieldSize.Medium,
        },
        {
          name: 'name',
          type: 'text',
          label: 'שם המכתב',
          validations: {
            // required: true,
            maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
        },
        {
          name: 'SMSDisplayName',
          type: 'selectWithLookup',
          label: ' כותרת להודעה sms',
          validations: {
            // required: true,
            maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'draftsAndLettersTicketTypes',
          type: 'checkboxOptions',
          label: 'סיווג דוח ',
          value: '',
          validations: {},
          disabled: false,
          hide: false,
          isRequired: true,
          size: DynamicFieldSize.Medium,
          options: [
            { value: 1, display: 'חניה' },
            { value: 2, display: 'כללי' },
            { value: 3, display: 'מנהלי' },
          ],
        },

        {
          name: 'emailDisplayName',
          type: 'selectWithLookup',
          label: 'כותרת להודעה דוא"ל',
          validations: {
            // required: true,
            // maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
        },

        {
          name: 'authorityID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'draftsAndLettersTypeId',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];
  public LetterForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'detail',
          type: 'details',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'img1',
          type: 'image',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 0,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getImagesTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'text2',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 1,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'text3',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 2,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'textArea4',
          type: 'text-area',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 3,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'img5',
          type: 'image',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 4,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getImagesTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'authorityID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public LetterFormWithIndictment: DynamicRow[] = [
    {
      row: [
        {
          name: 'detail',
          type: 'details',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },

    {
      row: [
        {
          name: 'textArea4',
          type: 'text-area',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'authorityID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public DraftForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'detail',
          type: 'details',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'img1',
          type: 'image',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 0,
          size: DynamicFieldSize.Small,
          dataFunction: {
            name: 'getImagesTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'text2',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 1,
          size: DynamicFieldSize.Small,
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'text3',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 2,
          size: DynamicFieldSize.Small,
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'text4',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 3,
          size: DynamicFieldSize.Small,
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'textArea5',
          type: 'text-area',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 4,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'img6',
          type: 'image',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 5,
          size: DynamicFieldSize.Small,
          dataFunction: {
            name: 'getImagesTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'textArea7',
          type: 'text-area',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 6,
          size: DynamicFieldSize.Small,
        },

        {
          name: 'img8',
          type: 'image',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 7,
          size: DynamicFieldSize.Small,
          dataFunction: {
            name: 'getImagesTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'text9',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          order: 8,
          size: DynamicFieldSize.Large,
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'authorityID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];
}
