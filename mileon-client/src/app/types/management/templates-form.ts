import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicRow } from '../infrastructure/InfrastructureTypes';

export class TemplatesForms {
  public TextTemplatesForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'templateTitle',
          type: 'text',
          label: 'כותרת התבנית',
          value: '',
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Large,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'templateBody',
          type: 'text-area',
          label: 'תוכן התבנית ',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'templateID',
          type: 'text',
          label: 'תוכן התבנית ',
          validations: { required: true },
          hide: true,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
  ];
  public CreateTextTemplatesForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'templateTitle',
          type: 'text',
          label: 'כותרת התבנית',
          value: '',
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Large,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'templateBody',
          type: 'text-area',
          label: 'תוכן התבנית ',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },

        {
          name: 'isRequired',
          type: 'text',
          label: 'תוכן הגלופה ',
          value: false,
          validations: { required: false },
          hide: true,
          size: DynamicFieldSize.Double,
          isRequired: false,
        },
        {
          name: 'name',
          type: 'text',
          label: 'תוכן הגלופה ',
          validations: { required: false },
          hide: true,
          size: DynamicFieldSize.Double,
          isRequired: false,
        },
      ],
    },
  ];

  public LogoOrSignatureTemplatesForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'templateTitle',
          type: 'text',
          label: 'כותרת התבנית',
          value: '',
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Large,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'templateBody',
          type: 'file',
          label: 'תוכן התבנית ',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'templateID',
          type: 'text',
          label: 'תוכן הגלופה ',
          validations: { required: true },
          hide: true,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
  ];
  public CreateLogoOrSignatureTemplatesForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'templateTitle',
          type: 'text',
          label: 'כותרת התבנית',
          value: '',
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Large,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'templateBody',
          type: 'file',
          label: 'תוכן התבנית ',
          validations: { required: true },
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },

        {
          name: 'isRequired',
          type: 'text',
          label: 'תוכן הגלופה ',
          value: false,
          validations: { required: false },
          hide: true,
          size: DynamicFieldSize.Double,
          isRequired: false,
        },
        {
          name: 'name',
          type: 'text',
          label: 'תוכן הגלופה ',
          validations: { required: false },
          hide: true,
          size: DynamicFieldSize.Double,
          isRequired: false,
        },
      ],
    },
  ];
}
