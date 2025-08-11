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
        displayName: 'פרטי עבירה',
        rows: [
          {
            group: [
              {
                name: 'parkingPermitStatusIDs',
                displayName: 'סטטוס תו',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getParkingPermitLookups',
                  objName: 'parkingPermitStatuses',
                },
              },
              {
                name: 'authorityIDs',
                displayName: 'רשות',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getAuthorities',
                },
              },
              {
                name: 'permitTypeIDs',
                displayName: 'סוג תו',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getParkingPermitTypes',
                  extraParams: [
                    {
                      connectedField: 'authorityIDs',
                      paramName: 'authorityIDs',
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
                name: 'vehicleNumber',
                displayName: 'מספר רכב',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'vehicleManufacturerIDs',
                displayName: 'יצרן רכב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getVehicleLookups',
                  objName: 'vehicleManufacturers',
                },
              },
              {
                name: 'vehicleColorIDs',
                displayName: 'צבע רכב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getVehicleLookups',
                  objName: 'vehicleColors',
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'payMethodId',
                displayName: 'צורת תשלום',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getParkingPermitLookups',
                  objName: 'paymentMethods',
                },
              },
              {
                name: 'isReturningResident', 
                displayName: 'ת.ח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getYesNoOptions',
                },
                multipleSelect: false,
              },
              {
                name: 'days',
                displayName: 'יום',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Short,
                dataFunction: {
                  name: 'getDays',
                },
              },
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
            ],
          },
          {
            group: [
              {
                name: 'time',
                displayName: 'שעת קליטה',
                type: FieldTypeEnum.DateTime,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'fromTime',
                displayName: 'מ-',
                type: FieldTypeEnum.DateTime,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'toTime',
                displayName: 'עד',
                type: FieldTypeEnum.DateTime,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'requestSourceIDs',
                displayName: 'מקור',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getParkingPermitLookups',
                  objName: 'requestSources',
                },
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
        name:'permitOwnerInfo',
        displayName: 'פרטי בעל התו',
        rows: [
          {
            name: "vehicle",
            group : [
              {
                name: 'vehicleNumber',
                displayName:'מספר רישוי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'modelName',
                displayName:'סוג רכב',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'colorName',
                displayName:'צבע',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'manufacturerName',
                displayName:'תוצרת',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ]
          },
          {
            name: 'citizen',
            group: [
              {
                name: 'nid',
                displayName:'ת.ז',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'passportID',
                displayName:'דרכון',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'firstName',
                displayName:'שם פרטי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'lastName',
                displayName:'שם משפחה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ]
          }
        ]
      }
    ]
  }

  public static EditParkingPermitDetailsTabs: AdvancedForm = {
    tabs: [
      {
        name:'permitOwnerInfo',
        displayName: 'פרטי בעל התו',
        rows: [
          {
            name: "vehicle",
            group : [
              {
                name: 'vehicleNumber',
                displayName:'מספר רישוי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'modelID',
                displayName:'סוג רכב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name:"getVehicleLookups",
                  objName: 'vehicleTypes'
                }
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
                displayName:'תוצרת',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name:"getVehicleManufacturer"
                }
              },
            ]
          },
          {
            name: 'citizen',
            group: [
              {
                name: 'nid',
                displayName:'ת.ז',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'passportID',
                displayName:'דרכון',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'firstName',
                displayName:'שם פרטי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'lastName',
                displayName:'שם משפחה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ]
          }
        ]
      }
    ]
  }

  public static addressFelids : Field[] = [
    {
      name: 'cityName',
      displayName: 'ישוב/עיר',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'streetName',
      displayName: 'רחוב',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
     
    },
    {
      name: 'houseNumber',
      displayName: 'מספר',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
    },
    {
      name: 'entrance',
      displayName: 'כניסה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
    },
    {
      name: 'apartment',
      displayName: 'דירה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
    },
    {
      name: 'postalCode',
      displayName: 'מיקוד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'mailbox',
      displayName: 'ת.ד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ]

  public static EditAddressFelids : Field[] = [
    {
      name: 'cityID',
      displayName: 'ישוב/עיר',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getCities' 
      }
    },
    {
      name: 'streetID',
      displayName: 'רחוב',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getStreets', 
        extraParams: [
          {
            connectedField: 'cityID',
            paramName: 'cityIDs'
          }
        ]
      }
    },
    {
      name: 'houseNumber',
      displayName: 'מספר',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
    },
    {
      name: 'entrance',
      displayName: 'כניסה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
    },
    {
      name: 'apartment',
      displayName: 'דירה',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Short,
    },
    {
      name: 'postalCode',
      displayName: 'מיקוד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'mailbox',
      displayName: 'ת.ד',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ]

  public static parkingPermitStatusFelids : Field[] = [
    {
      // I am not sure about this
      name: 'statusName', 
      displayName: 'סטטוס חידוש',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'renewalReasonName',
      displayName: 'סיבת חידוש',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
     
    },
    {
      name: 'permitTypeName',
      displayName: 'סוג תו',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ]
  
  // delete it 
  public static CreateParkingPermitStatusFelids : Field[] = [
    {
      name: 'permitTypeID',
      displayName: 'סוג תו',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
    },
  ]

  public static permitDetails: Field[] = [
    {
      name: 'requestSourceName', 
      displayName: 'צורת בקשת התו',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'requestDate', 
      displayName:  'שעת בקשה',
      type: FieldTypeEnum.Time,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'requestDate', 
      displayName: 'תאריך',
      type: FieldTypeEnum.Date,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'approvalDate', 
      displayName: 'תו נקלט בשעה',
      type: FieldTypeEnum.Time,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'approvalDate', 
      displayName: 'תו נקלט בתאריך',
      type: FieldTypeEnum.Date,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'userName', 
      displayName:'גורם מטפל',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
  ]

  public static permitArea :  Field[] = [
    {
      name: 'permitArea', 
      displayName:'גורם מטפל',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getPermitArea'
      }
    },
    {
      name: 'areaID', 
      displayName: 'איזור',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getAreas'
      }
    },
    {
      name: 'streetID', 
      displayName: 'רחוב',
      type: FieldTypeEnum.Select,
      length: FieldLengthEnum.Medium,
      dataFunction: {
        name: 'getStreets',
      }
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
    }
  ]
}

