import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicRow } from '../infrastructure/InfrastructureTypes';

export class MsofonForms {
  public TicketBookAddForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'seriesNumber',
          type: 'text',
          label: 'סדרה',
          value: '',
          validations: { required: true, pattern: '^[1-9]$' },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'bookNumber',
          type: 'text',
          label: 'מספר פנקס',
          validations: {
            required: true,
            maxLength: 100,
            // pattern: '^[A-Za-zא-ת,.]+$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          type: 'selectWithLookup',
          name: 'ticketTypeID',
          label: 'סוג דוח',
          value: true,
          dataFunction: {
            name: 'getTicketLookups',
            objName: 'ticketTypes',
          },

          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },
      ],
    },
    {
      row: [
        {
          name: 'inspectorID',
          type: 'selectWithLookup',
          label: 'שיוך לפקח ',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getInspectors',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
          isRequired: true,
          isMultiSelect: false,
        },
        {
          type: 'select',
          name: 'ticketCount',
          label: 'מקור קבלת הדוח',
          value: '',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          options: [
            { display: 'מסופון', value: 25 },
            { display: 'אחר', value: 100 },
          ],
          isMultiSelect: false,
          isRequired: true,
        },

        {
          type: 'text',
          name: 'authorityID',
          label: 'מקור קבלת הדוח',
          value: '',
          validations: { required: true },
          hide: true,
          size: DynamicFieldSize.Regular,

          isMultiSelect: false,
          isRequired: false,
        },
      ],
    },
  ];

  public TicketBookTransferForm: DynamicRow[] = [
    {
      row: [
        {
          type: 'text',
          name: 'inspectorName',
          label: 'משויך לפקח',
          value: '',
          dataFunction: {
            name: 'getInspectors',
          },

          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
          disabled: true,
        },
        {
          type: 'selectWithLookup',
          name: 'inspectorID',
          label: 'פקח לשיוך',
          value: '',
          dataFunction: {
            name: 'getInspectors',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },

          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },

        {
          type: 'selectWithLookup',
          name: 'ticketTypeID',
          label: 'פקח לשיוך',
          value: '',
          dataFunction: {
            name: 'getInspectors',
          },

          hide: true,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },
        {
          type: 'text',
          name: 'authorityID',
          label: 'מקור קבלת הדוח',
          value: '',
          validations: { required: true },
          hide: true,
          size: DynamicFieldSize.Regular,

          isMultiSelect: false,
          isRequired: false,
        },
        {
          type: 'text',
          name: 'TicketBookIDs',
          label: 'מקור קבלת הדוח',
          value: '',
          validations: { required: false },
          hide: true,
          size: DynamicFieldSize.Regular,

          isMultiSelect: false,
          isRequired: false,
        },
      ],
    },
  ];
  public InspectorsMessagesForm: DynamicRow[] = [
    {
      row: [
        {
          type: 'selectWithLookup',
          name: 'inspectorID',
          label: 'פקח',
          value: '',
          dataFunction: {
            name: 'getInspectors',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
          validations: { required: true },

          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },
      ],
    },
    {
      row: [
        {
          type: 'text',
          name: 'taskTitle',
          label: 'כותרת למשימה',
          value: '',
          validations: { required: true, maxLength: 50 },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },
      ],
    },

    {
      row: [
        {
          type: 'text',
          name: 'taskDescription',
          label: 'תיאור',
          value: '',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Large,
          isRequired: true,
          isMultiSelect: false,
        },
      ],
    },
    {
      row: [
        {
          type: 'text',
          name: 'authorityID',
          label: 'תיאור',
          value: '',

          hide: true,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },
      ],
    },
  ];

  public LegalitySettingsForm: DynamicRow[] = [
    {
      row: [
        {
          type: 'select',
          name: 'SwPrintDochBreratMispat ',
          label: 'כותרת לפתקית ',
          value: '',
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: true,
          isMultiSelect: false,
          disabled: false,

          options: [
            { value: '0', display: 'ברירת מחדל' },
            { value: '1', display: 'ברירת משפט' },
          ],
        },
        {
          type: 'text',
          name: 'MinMinutesForTicket',
          label: ' מינימום דקות לדוח ',
          value: '',
          validations: { min: 0, max: 240, pattern: '^[0-9]+$' },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: false,
          isMultiSelect: false,
        },

        {
          type: 'text',
          name: 'ContinuousOffenseAmount',
          label: ' סכום עבירה מתמשכת ',
          value: '',
          validations: { min: 1, max: 999999, pattern: '^[0-9]+$' },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: false,
          isMultiSelect: false,
        },
        {
          type: 'text',
          name: 'DaysForContinuousOffense',
          label: ' מספר ימים לחישוב עבירה מתמשכת ',
          value: '',
          validations: { min: 1, max: 999999, pattern: '^[0-9]+$' },
          hide: false,
          size: DynamicFieldSize.Medium,
          isRequired: false,
          isMultiSelect: false,
        },
      ],
    },
    {
      row: [
        {
          type: 'text-area',
          name: 'ShortViolationTitle',
          label: ' כותרת לעבירה  ',
          value: '',
          hide: false,
          size: DynamicFieldSize.Square,
          isRequired: false,
          isMultiSelect: false,
          validations: { maxLength: 1000 },
        },
      ],
    },
  ];
}
