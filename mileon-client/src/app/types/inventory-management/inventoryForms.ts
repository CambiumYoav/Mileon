import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicRow } from '../infrastructure/InfrastructureTypes';

export class InventoryForms {
  public InventoryForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'deviceId',
          type: 'text',
          label: 'קוד',
          hide: false,
          size: DynamicFieldSize.Regular,
          disabled: true,
        },
        {
          name: 'typeId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getDeviceTypes',
          },
          label: 'סוג ציוד',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          disabled: false,
          isRequired: true,
          isMultiSelect: false,
        },
        {
          name: 'sn',
          type: 'text',
          label: 'מזהה ציוד',
          validations: {
            required: true,
            maxLength: 30,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          disabled: true,
          isRequired: true,
        },
        {
          type: 'text',
          name: 'description',
          label: 'תיאור',
          value: true,
          validations: {
            required: true,
            maxLength: 150,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },

    {
      row: [
        {
          name: 'authorityId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getAuthoritiesNoFilter',
          },
          isMultiSelect: false,
          label: 'רשות',
          options: [],
          hide: false,
          size: DynamicFieldSize.Regular,
          validations: { required: false },
        },
        {
          //releated to authority
          name: 'inspectorId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getInspectors',
            extraParams: [
              {
                connectedField: 'authorityId',
                paramName: 'authorityID',
              },
            ],
          },
          value: '',
          options: [],
          label: 'שם פקח',
          isMultiSelect: false,
          validations: { required: true }, //reqired if authority
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'roleId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getSystemRoles',
          },
          label: 'תפקיד',
          validations: { maxLength: 100, required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          options: [],
          isMultiSelect: false,
          isRequired: true,
        },
        {
          name: 'divisionIds',
          type: 'checkboxOptions',
          value: '',

          label: 'מחלקה משוייכת',
          validations: { required: true }, //reqired if authority
          hide: false,
          size: DynamicFieldSize.Regular,
          isMultiSelect: true,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'inspectorPhone',
          type: 'text',
          value: '',
          label: 'טלפון',
          validations: {
            maxLength: 10,
            required: true,
            pattern: '^(05[0-9])?[0-9]{7}$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          name: 'cellularOperatorId',
          type: 'selectWithLookup',
          value: '',
          label: 'מפעיל סלולר',
          validations: { required: true },
          dataFunction: {
            name: 'getCellularOperators',
          },

          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },
        {
          name: 'dateDelivery',
          type: 'date',
          value: '',
          label: 'תאריך מסירה',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'statusId',
          type: 'selectWithLookup',
          value: '',
          dataFunction: {
            name: 'getDeviceStatuses',
          },
          label: 'סטטוס ציוד',
          validations: { maxLength: 100, required: true },
          options: [],
          isMultiSelect: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
  ];
  public CreateInventoryForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'deviceId',
          type: 'text',
          label: 'קוד',
          hide: false,
          size: DynamicFieldSize.Regular,
          disabled: true,
        },
        {
          name: 'typeId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getDeviceTypes',
          },
          label: 'סוג ציוד',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          disabled: false,
          isRequired: true,
          isMultiSelect: false,
        },
        {
          name: 'sn',
          type: 'text',
          label: 'מזהה ציוד',
          validations: {
            required: true,
            maxLength: 30,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          disabled: false,
          isRequired: true,
        },
        {
          type: 'text',
          name: 'description',
          label: 'תיאור',
          value: '',
          validations: {
            required: true,
            maxLength: 150,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },

    {
      row: [
        {
          name: 'authorityId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getAuthoritiesNoFilter',
          },
          isMultiSelect: false,
          label: 'רשות',
          options: [],
          hide: false,
          size: DynamicFieldSize.Regular,
          validations: { required: false },
        },
        {
          //releated to authority
          name: 'inspectorId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getInspectors',
            extraParams: [
              {
                connectedField: 'authorityId',
                paramName: 'authorityID',
              },
            ],
          },
          value: '',
          options: [],
          label: 'שם פקח',
          isMultiSelect: false,
          validations: { required: true }, //reqired if authority
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          // disabled:true,
        },
        {
          name: 'roleId',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getSystemRoles',
          },
          label: 'תפקיד',
          validations: { maxLength: 100, required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          options: [],
          isMultiSelect: false,
          isRequired: true,
        },

        {
          name: 'divisionIds',
          type: 'checkboxOptions',
          value: '',
          options: [
            { value: 2, display: 'חניה' },
            { value: 3, display: 'כללי' },
            { value: 1, display: 'מנהלי' },
          ],
          label: 'מחלקה משוייכת',
          validations: { required: true }, //reqired if authority
          hide: false,
          size: DynamicFieldSize.Regular,
          isMultiSelect: true,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'inspectorPhone',
          type: 'text',
          value: '',
          label: 'טלפון',
          validations: {
            maxLength: 10,
            required: true,
            pattern: '^(05[0-9])?[0-9]{7}$',
          }, //phone pattern
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'cellularOperatorId',
          type: 'selectWithLookup',
          value: '',
          label: 'מפעיל סלולר',
          validations: { required: true },
          dataFunction: {
            name: 'getCellularOperators',
          },

          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          isMultiSelect: false,
        },
        {
          name: 'dateDelivery',
          type: 'date',
          value: '',
          label: 'תאריך מסירה',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'statusId',
          type: 'selectWithLookup',
          value: '',
          dataFunction: {
            name: 'getDeviceStatuses',
          },
          label: 'סטטוס ציוד',
          validations: { maxLength: 100, required: true },
          options: [],
          isMultiSelect: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
  ];
}
