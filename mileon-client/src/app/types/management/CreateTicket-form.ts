import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicRow } from '../infrastructure/InfrastructureTypes';

export class TicketsGeneratorForm {
  public TicketsGeneratorCameraForm: DynamicRow[] = [
    {
      row: [
        {
          type: 'selectWithLookup',
          name: 'inspectorID',
          label: 'מזהה פקח',
          value: '',
          dataFunction: {
            name: 'getInspectors',
          },
          hide: false,
          size: DynamicFieldSize.Double,
          options: [],
          isMultiSelect: false,
        },
        {
          name: 'ticketNumber',
          type: 'select',
          label: 'מספר דוח',
          placeholder: 'מספר דוח',
          value: '',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'vheicleNumber',
          type: 'text',
          label: 'מספר רכב',
          value: '5925935',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'ticketDate',
          type: 'date',
          label: 'תאריך',
          value: new Date(),
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'ticketTime',
          type: 'time',
          label: 'שעה',
          value: new Date().toTimeString().slice(0, 5),
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'violationID',
          type: 'number',
          label: 'עבירה',
          value: 0,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'authorityNumber',
          type: 'number',
          label: 'מספר רשות',
          value: '1111',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'inspectorNumber',
          type: 'number',
          label: 'מספר פקח',
          value: '12',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'inspectorDescription',
          type: 'text',
          label: 'תיאור',
          value: 'דוח חניה עבור מס רכב 5925935',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'inspectorReservedRemarks',
          type: 'text',
          label: 'הערות פקח',
          value: [],
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'houseNumber',
          type: 'number',
          label: 'מספר בית',
          value: 26,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'streetID',
          type: 'number',
          label: 'מספר רחוב',
          value: 3,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'locationID',
          type: 'number',
          label: 'מזהה מיקום',
          value: null,
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
        },
        {
          name: 'movieLinks',
          type: 'text',
          label: 'צילום',
          value: ['https://youtu.be/_0TZAknOmko'],
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
  ];
  public TicketsGeneratorTerminalForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'clientdate',
          type: 'date',
          label: 'תאריך מסופון',
          value: new Date(),
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'authorityID',
          type: 'text',
          label: 'מזהה רשות',
          value: '9D24F102-DBCC-49BC-8258-0B58AF257B89',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          type: 'selectWithLookup',
          name: 'inspectorID',
          label: 'מזהה פקח',
          value: '',
          dataFunction: {
            name: 'getInspectors',
          },
          hide: false,
          size: DynamicFieldSize.Double,
          options: [],
          isMultiSelect: false,
        },
        {
          name: 'ticketNumber',
          type: 'select',
          label: 'מספר דוח',
          placeholder: 'מספר דוח',
          value: '',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'vehicleID',
          type: 'text',
          label: 'מזהה רכב',
          value: '61609320-FD4D-4011-64D2-08DC10F022AB',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'violationID',
          type: 'text',
          label: 'מזהה עברה',
          value: '313F3B39-9482-45CA-8CC9-00E73763816E',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'violationLocation',
          type: 'number',
          label: 'מיקום עבירה',
          value: 1,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'streetID',
          type: 'number',
          label: 'מזהה רחוב',
          value: 4,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'houseNumber',
          type: 'number',
          label: 'מספר בית',
          value: 1,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
  ];
}
