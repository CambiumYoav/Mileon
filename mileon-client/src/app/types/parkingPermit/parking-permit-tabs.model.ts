import {
  AdvancedForm,
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';

export class ParkingPermitTabs {
  public static ParkingPermitTabs: AdvancedForm = {
    tabs: [
      {
        name: 'parkingPermitsOptionsFilter',
        displayName: 'פרטי תו דייר',
        rows: [
          {
            group: [
              {
                name: 'parkingPermitStatusIDs',
                displayName: 'סטטוס תו',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                multipleSelect: true,
                dataFunction: {
                  name: 'getParkingPermitLookups',
                  objName: 'parkingPermitStatuses',
                },
              },

              {
                name: 'permitTypeIDs',
                displayName: 'סוג תו',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                multipleSelect: true,
                dataFunction: {
                  name: 'getParkingPermitTypesByAuthority',
                  extraParams: [
                    {
                      connectedField: 'authorityIDs',
                      paramName: 'authorityID',
                    },
                  ],
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'areaIDs',
                displayName: 'אזור',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                multipleSelect: true,
                dataFunction: {
                  name: 'getAreas',
                  extraParams: [
                    {
                      connectedField: 'authorityIDs',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },
              {
                name: 'streetIDs',
                displayName: 'רחוב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                multipleSelect: true,
                dataFunction: {
                  name: 'getStreets',
                  extraParams: [
                    {
                      connectedField: 'authorityIDs',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },
              {
                name: 'houseNumber',
                displayName: 'מספר בית',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Short,
                connectedField: 'streetIDs',
              },
            ],
          },

          {
            group: [
              {
                name: 'fromExpirationDate',
                displayName: 'תוקף מתאריך',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'toExpirationDate',
                displayName: 'תוקף עד תאריך',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              // need to add in the server
              {
                name: 'requestDate',
                displayName: 'תאריך  קליטה',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
    ],
  };

  public static ParkingPermitDetailsTabs: AdvancedForm = {
    tabs: [
      {
        name: 'permitOwnerInfo',
        displayName: 'פרטי בעל התו',
        rows: [
          {
            name: 'vehicle',
            group: [
              {
                name: 'vehicleNumber',
                displayName: 'מספר רישוי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'modelName',
                displayName: 'סוג רכב',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'colorName',
                displayName: 'צבע',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'manufacturerName',
                displayName: 'תוצרת',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
          {
            name: 'citizen',
            group: [
              {
                name: 'nid',
                displayName: 'תעודת זהות',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                disabled: true,
              },
              {
                name: 'passportID',
                displayName: 'דרכון',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                disabled: true,
              },
              {
                name: 'firstName',
                displayName: 'שם פרטי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'lastName',
                displayName: 'שם משפחה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
    ],
  };

  public static EditParkingPermitDetailsTabs: AdvancedForm = {
    tabs: [
      {
        name: 'permitOwnerInfo',
        displayName: 'פרטי בעל התו',
        rows: [
          {
            name: 'vehicle',
            group: [
              {
                name: 'vehicleNumber',
                displayName: 'מספר רישוי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'modelID',
                displayName: 'סוג רכב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getVehicleLookups',
                  objName: 'vehicleTypes',
                },
              },
              {
                name: 'colorID',
                displayName: 'צבע',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getVehicleLookups',
                  objName: 'vehicleColors',
                },
              },
              {
                name: 'manufacturerID',
                displayName: 'תוצרת',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getVehicleManufacturer',
                },
              },
            ],
          },
          {
            name: 'citizen',
            group: [
              {
                name: 'nid',
                displayName: 'תעודת זהות',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                disabled: true,
              },
              {
                name: 'passportID',
                displayName: 'דרכון',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                disabled: true,
              },
              {
                name: 'firstName',
                displayName: 'שם פרטי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'lastName',
                displayName: 'שם משפחה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'birthDate',
                displayName: 'תאריך לידה',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'genderID',
                displayName: 'מין',
                type: FieldTypeEnum.Radio,
                length: FieldLengthEnum.Medium,
                radioOptions: [
                  { value: 1, display: 'זכר' },
                  { value: 2, display: 'נקבה' },
                ],
              },
         
              {
                name: 'isReturningResident',
                displayName: 'תושב חוזר',
                type: FieldTypeEnum.Radio,
                length: FieldLengthEnum.Medium,
                radioOptions: [
                  { value: true, display: 'כן' },
                  { value: false, display: 'לא' },
                ],
              },
            ],
          },
          // {
          //   name: 'citizen1',
          //   group: [
          //     {
          //       name: 'birthDate',
          //       displayName: 'תאריך לידה',
          //       type: FieldTypeEnum.Date,
          //       length: FieldLengthEnum.Medium,
          //     },
          //     {
          //       name: 'genderID',
          //       displayName: 'מין',
          //       type: FieldTypeEnum.Radio,
          //       length: FieldLengthEnum.Medium,
          //       radioOptions: [
          //         { value: 1, display: 'זכר' },
          //         { value: 2, display: 'נקבה' },
          //       ],
          //     },
          //     // not sending to server
          //     {
          //       name: 'isReturningResident',
          //       displayName: 'תושב חוזר',
          //       type: FieldTypeEnum.Radio,
          //       length: FieldLengthEnum.Medium,
          //       radioOptions: [
          //         { value: true, display: 'כן' },
          //         { value: false, display: 'לא' },
          //       ],
          //     },
          //   ],
          // },
        ],
      },
    ],
  };
  public static additionalCitizenFields: AdvancedForm = {
    tabs: [
      {
        name: 'permitOwnerInfoAdditional',
        displayName: 'פרטי בעל התו',
        rows: [
          {
            name: 'citizen',
            group: [
              {
                name: 'birthDate',
                displayName: 'תאריך לידה',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'genderID',
                displayName: 'מין',
                type: FieldTypeEnum.Radio,
                length: FieldLengthEnum.Medium,
                radioOptions: [
                  { value: 1, display: 'זכר' },
                  { value: 2, display: 'נקבה' },
                ],
              },
              // not sending to server
              {
                name: 'isReturningResident',
                displayName: 'תושב חוזר',
                type: FieldTypeEnum.Radio,
                length: FieldLengthEnum.Medium,
                radioOptions: [
                  { value: true, display: 'כן' },
                  { value: false, display: 'לא' },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  public static addressFields: Field[] = [
    {
      name: 'cityName',
      displayName: 'ישוב/עיר',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
      disabled: true,
    },
    {
      name: 'streetName',
      displayName: 'רחוב',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
      disabled: true,
    },
    {
      name: 'houseNumber',
      displayName: 'מספר',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
      disabled: true,
    },
    {
      name: 'entrance',
      displayName: 'כניסה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
      disabled: true,
    },
    {
      name: 'apartment',
      displayName: 'דירה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
      disabled: true,
    },
    {
      name: 'postalCode',
      displayName: 'מיקוד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
      disabled: true,
    },
    {
      name: 'mailbox',
      displayName: 'ת.ד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ];

  public static EditAddressFelids: Field[] = [
    {
      name: 'cityID',
      displayName: 'ישוב/עיר',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      disabled: true,
      dataFunction: {
        name: 'getCities',
      },
    },
    {
      name: 'streetID',
      displayName: 'רחוב',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      disabled: true,
      dataFunction: {
        name: 'getStreets',
        extraParams: [
          {
            connectedField: 'cityID',
            paramName: 'cityIDs',
          },
        ],
      },
    },
    {
      name: 'houseNumber',
      displayName: 'מספר',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
      disabled: true,
    },
    {
      name: 'entrance',
      displayName: 'כניסה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
      disabled: true,
    },
    {
      name: 'apartment',
      displayName: 'דירה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
      disabled: true,
    },
    {
      name: 'postalCode',
      displayName: 'מיקוד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
      disabled: true,
    },
    {
      name: 'mailbox',
      displayName: 'ת.ד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ];

  public static parkingPermitStatusFields: Field[] = [
    {
      // I am not sure about this
      name: 'statusName',
      displayName: 'סטטוס חידוש',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    // {
    //   name: 'renewalReasonName',
    //   displayName: 'סיבת חידוש',
    //   type: FieldTypeEnum.Text,
    //   length: FieldLengthEnum.Medium,
    // },
    {
      name: 'permitTypeName',
      displayName: 'סוג תו',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ];

  public static PermitByFields: Field[] = [
    {
      name: 'permitBy',
      displayName: 'תו לפי ',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Long,
      disabled: true,
      dataFunction: {
        name: 'getPermitArea',
      },
    },
  ];
  public static PermitAreaFields: Field[] = [
    {
      name: 'areaID',
      displayName: 'איזור ',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Long,
      disabled: true,
      connectedField: 'authorityID',
      dataFunction: {
        name: 'getAreas',
        extraParams: [
          {
            connectedField: 'authorityID',
            paramName: 'authorityIDs',
          },
        ],
      },
    },
  ];

  // delete it
  public static CreateParkingPermitStatusFelids: Field[] = [
    {
      name: 'permitTypeID',
      displayName: 'סוג תו',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
    },
  ];

  public static permitDetails: Field[] = [
    {
      name: 'requestSourceName',
      displayName: 'צורת בקשת התו',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'requestDate',
      displayName: 'שעת בקשה',
      type: FieldTypeEnum.Time,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'requestDate',
      displayName: 'תאריך',
      type: FieldTypeEnum.Date,
      length: FieldLengthEnum.Medium,
    },
    // {
    //   name: 'approvalDate',
    //   displayName: 'תו נקלט בשעה',
    //   type: FieldTypeEnum.Time,
    //   length: FieldLengthEnum.Medium,
    // },
    // {
    //   name: 'approvalDate',
    //   displayName: 'תו נקלט בתאריך',
    //   type: FieldTypeEnum.Date,
    //   length: FieldLengthEnum.Medium,
    // },
    {
      name: 'userName',
      displayName: 'גורם מטפל',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ];

  public static permitArea: Field[] = [
    {
      name: 'permitArea',
      displayName: 'גורם מטפל',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getPermitArea',
      },
    },
    {
      name: 'areaID',
      displayName: 'איזור',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getAreas',
      },
    },
    {
      name: 'streetID',
      displayName: 'רחוב',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getStreets',
      },
    },
    {
      name: 'fromEventHouseNumber',
      displayName: '',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'toEventHouseNumber',
      displayName: '',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'fromNotEventHouseNumber',
      displayName: '',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'toNotEventHouseNumber',
      displayName: '',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ];
}
