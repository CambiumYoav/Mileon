import { isDevMode } from '@angular/core';
import {
  DynamicFieldSize,
  InfrastructureTablesTypes,
} from '../enum/infrastructureTablesEnum';
import { SubStagesTypesEnum } from '../enum/subStagesEnum';
import { Column, ColumnTypeEnum } from '../table';
import { AnimalStatusEnum } from '../enum/animalStatusEnum';
import { RelatedGroupEnum } from '../enum/relatedGroupEnum';
import { DynamicRow, SpecialTableTypes } from './InfrastructureTypes';

export class InfrastructureTable {
  public TypeTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'vehicleTypeID',
      sortField: 'vehicleTypeID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'vehicleTypeID',
    },
    {
      displayName: 'תיאור',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'name',
    },
    {
      displayName: 'סטטוס',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Active,
      sortByServer: true,
      fieldId: 'isActive',
    },
    {
      displayName: 'קוד לאוטומציה',
      propertyName: 'automationCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'automationCode',
    },
  ];
  public ColorTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'vehicleColorID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'vehicleColorID',
    },
    {
      displayName: 'צבע',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'name',
    },
    {
      displayName: 'סטטוס',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Active,
      sortByServer: true,
      fieldId: 'isActive',
    },
    {
      displayName: 'קוד לאוטומציה',
      propertyName: 'automationCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'automationCode',
    },
  ];
  public ManufactureTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'manufacturerID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'manufacturerID',
    },
    {
      displayName: 'תוצרת',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'name',
    },
    {
      displayName: 'סטטוס',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Active,
      sortByServer: true,
      fieldId: 'isActive',
    },
    {
      displayName: 'קוד לאוטומציה',
      propertyName: 'automationCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'automationCode',
    },
  ];

  public SubStagesTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'subStageID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'subStageID',
    },
    {
      displayName: 'תיאור',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'name',
    },

    {
      displayName: 'סטטוס',
      propertyName: 'ticketStatusName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketStatusName',
    },

    {
      displayName: 'סוג',
      propertyName: 'type',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'type',
    },
    {
      displayName: 'פעיל/לא פעיל',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Active,
      sortByServer: true,
      fieldId: 'isActive',
    },
    {
      displayName: '',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.SubStageIcon,
      sortByServer: true,
      fieldId: 'isActive',
    },
  ];

  public ViloationTypesTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'violationTypeID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'violationTypeID',
    },
    {
      displayName: 'תיאור',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'name',
    },

    {
      displayName: 'משויך לסוג דוח',
      propertyName: 'ticketTypeID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketTypeID',
    },
    {
      displayName: 'קוד לאוטומציה',
      propertyName: 'automationCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'automationCode',
    },

    {
      displayName: 'קוד ממשק למג"ק ',
      propertyName: 'magakInterfaceCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'MAGAKInterfaceCode',
    },

    {
      displayName: 'קוד ממשק מטרופארק',
      propertyName: 'metroparkInterfaceCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'metroparkInterfaceCode',
    },
    {
      displayName: '',
      propertyName: '',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: '',
    },
  ];

  public TicketsSourceAndMethodTable: Column[] = [
    {
      displayName: 'מקור קבלת הדוח',
      propertyName: 'ticketSourceName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketSourceName',
    },
    {
      displayName: 'קוד',
      propertyName: 'deliveryMethodID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'deliveryMethodID',
    },
    {
      displayName: 'שיטת מסירה',
      propertyName: 'deliveryMethodName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'deliveryMethodName',
    },
    {
      displayName: 'סוג דוח',
      propertyName: 'ticketTypeName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'automationCode',
    },

    {
      displayName: 'העברה לשלב',
      propertyName: 'ticketStageName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'automationCode',
    },
    {
      displayName: '',
      propertyName: '',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: '',
    },
  ];

  public TicketsStatusesTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'ticketStatusID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketStatusID',
    },
    {
      displayName: 'תיאור',
      propertyName: 'ticketStatusName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketStatusName',
    },
  ];

  public TicketsStagesTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'stageID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'stageID',
    },
    {
      displayName: 'תיאור',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'name',
    },
  ];

  public CitizenTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'citizenCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'citizenCode',
    },
    {
      displayName: 'תעודת זהות',
      propertyName: 'nid',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'nid',
    },
    {
      displayName: 'שם מלא',
      propertyName: 'firstName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      additionalText: 'lastName',
      fieldId: 'firstName',
    },
    {
      displayName: 'כתובת מלאה',
      propertyName: 'homeAddressFormatted',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'homeAddressFormatted',
    },

    {
      displayName: 'טלפון',
      propertyName: 'citizenPhoneFormatted',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'citizenPhoneFormatted',
    },
    {
      displayName: 'עיר',
      propertyName: 'city',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'city',
    },

    {
      displayName: 'תאריך עדכון',
      propertyName: 'lastUpdated',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'lastUpdated',
    },
    {
      displayName: '',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: 'name',
    },
    {
      displayName: '',
      propertyName: 'citizenID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: true,
      fieldId: 'citizenID',
    },
  ];

  public StreetsTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'streetID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'streetID',
    },
    {
      displayName: 'שם רחוב',
      propertyName: 'streetName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'streetName',
    },
    {
      displayName: 'אזור תו דייר',
      propertyName: 'streetCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'streetCode',
    },
    {
      displayName: 'אזור פיקוח',
      propertyName: 'streetID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'streetID',
    },
    {
      displayName: '',
      propertyName: '',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: '',
    },
  ];
  public AreasTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'areaID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'areaID',
    },
    {
      displayName: 'שם אזור',
      propertyName: 'areaName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'areaName',
    },
    {
      displayName: 'הגדרת אזור',
      propertyName: 'parkingTypeDisplay',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'parkingTypeDisplay',
    },
    {
      displayName: 'רחובות מקושרים',
      propertyName: 'streetsDisplay',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'streetsDisplay',
    },
    {
      displayName: '',
      propertyName: '',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: '',
    },
  ];

  public ChipsTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'chipID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'chipID',
    },
    {
      displayName: 'מספר שבב',
      propertyName: 'chipNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'chipNumber',
    },

    {
      displayName: 'תעודת זהות',
      propertyName: 'ownerID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ownerID',
    },
    {
      displayName: 'שם מלא בעלים',
      propertyName: 'firstName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      additionalText: 'lastName',
      fieldId: 'firstName',
    },

    {
      displayName: 'כתובת מלאה',
      propertyName: 'fullAddress',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'fullAddress',
    },

    {
      displayName: 'תאריך עדכון',
      propertyName: 'updateDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'updateDate',
    },
    {
      displayName: '',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: 'name',
    },
  ];

  public PlaintiffsCausesTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'reservedRemarkID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'reservedRemarkID',
    },
    {
      displayName: 'תיאור',
      propertyName: 'remark',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'remark',
    },
    {
      displayName: 'שיוך לקבוצה',
      propertyName: 'relatedGroupName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'relatedGroupName',
    },
    {
      displayName: 'סטטוס',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Active,
      sortByServer: true,
      fieldId: 'isActive',
    },

    {
      displayName: 'הדפסת ספח',
      propertyName: 'isPrintOnTicketHebrew',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'isPrintOnTicket',
    },

    {
      displayName: 'קוד מכתב חניה',
      propertyName: 'parkingMailCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'parkingMailCode',
    },
    {
      displayName: 'קוד מכתב כללי',
      propertyName: 'generalMailCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'generalMailCode',
    },
    {
      displayName: 'קוד מכתב מנהלי',
      propertyName: 'adminMailCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'adminMailCode',
    },
    {
      displayName: 'סוג דוח',
      propertyName: 'ticketTypeID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketType',
    },
    {
      displayName: 'שיוך להחלטה',
      propertyName: 'decisionCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'decisionCode',
    },
    {
      displayName: ' ',
      propertyName: '',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: '',
    },
  ];

  public SignsTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'id',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'id',
    },
    {
      displayName: 'מספר שלט',
      propertyName: 'signNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'signNumber',
    },

    {
      displayName: 'תיאור שלט',
      propertyName: 'signDescription',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'signDescription',
    },

    {
      displayName: 'רחוב',
      propertyName: 'streetName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'streetName',
    },

    {
      displayName: 'טלפון',
      propertyName: 'citizenPhone',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'citizenPhone',
    },
    {
      displayName: 'פעיל/לא פעיל',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Active,
      sortByServer: true,
      fieldId: 'isActive',
    },
    {
      displayName: 'תאריך עדכון',
      propertyName: 'lastUpdated',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'lastUpdated',
    },

    {
      displayName: ' ',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: 'name',
    },
  ];

  public BusinessTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'id',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'id',
    },
    {
      displayName: 'ח.פ',
      propertyName: 'identification',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'identification',
    },

    {
      displayName: 'שם העסק',
      propertyName: 'businessName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'businessName',
    },
    {
      displayName: 'כתובת מלאה',
      propertyName: 'fullAddress',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'fullAddress',
    },

    {
      displayName: 'טלפון',
      propertyName: 'mobilePhone',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'mobilePhone',
    },
    {
      displayName: 'עיר',
      propertyName: 'city',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'city',
    },
    {
      displayName: 'תאריך עדכון',
      propertyName: 'lastUpdated',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'lastUpdated',
    },
    {
      displayName: '',
      propertyName: 'lastUpdated',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: 'lastUpdated',
    },
  ];
  public ViolationsProcessTypesTable: Column[] = [
    {
      displayName: 'מזהה',
      propertyName: 'violationID',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'violationID',
    },
    {
      displayName: 'תאור קצר',
      propertyName: 'shortDescription',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'shortDescription',
    },
    {
      displayName: 'תהליכים',
      propertyName: 'violationProcessTypes',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'violationProcessTypes',
    },

  ]
  public ViolationsTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'violationCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'violationCode',
    },
    {
      displayName: 'תיאור',
      propertyName: 'description',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'description',
    },
    // description
    {
      displayName: 'סוג דוח',
      propertyName: 'ticketTypeName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketTypeName',
    },
    {
      displayName: 'סעיף',
      propertyName: 'section',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'section',
    },

    {
      displayName: 'קנס',
      propertyName: 'fineAmount',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'fineAmount',
    },
    {
      displayName: 'ימים לתשלום',
      propertyName: 'minimumTimeInMinutesToNextTicket',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'minimumTimeInMinutesToNextTicket',
    },
    {
      displayName: 'צילום תמונה',
      propertyName: 'photoRequiredDisplay',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'photoRequiredDisplay',
    },
    {
      displayName: ' ',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: 'name',
    },
  ];
  public TollsTable: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'id',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'id',
    },
    {
      displayName: 'תיאור אגרה',
      propertyName: 'description',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'description',
    },

    {
      displayName: 'סכום אגרה',
      propertyName: 'price',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'price',
    },
    {
      displayName: 'סוג אגרה',
      propertyName: 'feeTypeName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'feeTypeName',
    },
    {
      displayName: ' ',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: true,
      fieldId: 'name',
    },
  ];
  public SpecialsDisabledTable: Column[] = [
    {
      displayName: 'מספר רישוי',
      propertyName: 'vehicleNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'vehicleNumber',
    },
    {
      displayName: 'תאריך הנפקה',
      propertyName: 'badgeCreationDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'badgeCreationDate',
    },

    {
      displayName: 'נכון לתאריך',
      propertyName: 'uploadDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'uploadDate',
    },
    {
      displayName: 'קוד סוג רכב',
      propertyName: 'disabledTagType',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'disabledTagType',
    },
  ];

  public SpecialsPublicTable: Column[] = [
    {
      displayName: 'מספר רישוי',
      propertyName: 'vehicleNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'vehicleNumber',
    },
    //FIXME -  add
    {
      displayName: 'תאריך הנפקה',
      propertyName: 'badgeCreationDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'badgeCreationDate',
    },

    {
      displayName: 'נכון לתאריך',
      propertyName: 'uploadDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
      fieldId: 'uploadDate',
    },
    {
      displayName: 'קוד סוג רכב',
      propertyName: 'vehicleTypeCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'vehicleTypeCode',
    },
    {
      displayName: 'קוד סוג היברידי',
      propertyName: 'additionalTypeCode',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'additionalTypeCode',
    },
  ];
}

export class InfrastructureForms {
  public InfrastructureTypeForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'vehicleTypeID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'name',
          type: 'text',
          label: 'תיאור',
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
          type: 'select',
          name: 'isActive',
          label: 'סטטוס',
          value: true,
          options: [
            { value: true, display: 'פעיל' },
            { value: false, display: 'לא פעיל' },
          ],
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'automationCode',
          type: 'text',
          label: 'קוד לאוטומציה',
          validations: { maxLength: 5, pattern: '^\\d+$' },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'vehicleTypeDescription',
          type: 'text',
          value: '',
          label: 'תיאור',
          validations: { maxLength: 100 },
          hide: true,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'sendToDevice',
          type: 'select',
          options: [
            { value: true, display: 'פעיל' },
            { value: false, display: 'לא פעיל' },
          ],
          value: false,
          label: 'שליחה',
          validations: { maxLength: 100 },
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];
  public InfrastructureColorForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'vehicleColorID',
          type: 'number',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'name',
          type: 'text',
          label: 'צבע',
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
          type: 'select',
          name: 'isActive',
          label: 'סטטוס',
          value: true,
          options: [
            { value: true, display: 'פעיל' },
            { value: false, display: 'לא פעיל' },
          ],
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'automationCode',
          type: 'text',
          label: 'קוד לאוטומציה',
          validations: { maxLength: 5, pattern: '^\\d+$' },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'vehicleTypeDescription',
          type: 'text',
          value: '',
          label: 'תיאור',
          validations: { maxLength: 100 },
          hide: true,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'sendToDevice',
          type: 'select',
          options: [
            { value: true, display: 'פעיל' },
            { value: false, display: 'לא פעיל' },
          ],
          value: false,
          label: 'שליחה',
          validations: { maxLength: 100 },
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public InfrastructureManufacturerForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'manufacturerID',
          type: 'number',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'name',
          type: 'text',
          label: 'תוצרת',
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
          type: 'select',
          name: 'isActive',
          label: 'סטטוס',
          value: true,
          options: [
            { value: true, display: 'פעיל' },
            { value: false, display: 'לא פעיל' },
          ],
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'automationCode',
          type: 'text',
          label: 'קוד לאוטומציה',
          validations: { maxLength: 5, pattern: '^\\d+$' },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'vehicleTypeDescription',
          type: 'text',
          value: '',
          label: 'תיאור',
          validations: { maxLength: 100 },
          hide: true,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'sendToDevice',
          type: 'select',
          options: [
            { value: true, display: 'פעיל' },
            { value: false, display: 'לא פעיל' },
          ],
          value: false,
          label: 'שליחה',
          validations: { maxLength: 100 },
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public InfrastructureSubStagesForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'subStageID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'name',
          type: 'text',
          label: 'תיאור',
          hide: false,
          size: DynamicFieldSize.Regular,
          validations: {
            required: true,
            maxLength: 150,
          },
          isRequired: true,
        },
        {
          type: 'selectWithLookup',
          name: 'ticketStatusID',
          label: 'סטטוס',
          value: null,
          hide: false,
          size: DynamicFieldSize.Regular,
          options: [],
          dataFunction: {
            name: 'getTicketLookups',
            objName: 'ticketStages',
          },
          isMultiSelect: false,
        },
      ],
    },

    {
      row: [
        {
          name: 'type',
          type: 'select',
          label: 'סוג',
          value: null,
          hide: false,
          size: DynamicFieldSize.Regular,
          validations: {
            required: true,
          },
          options: Object.entries(SubStagesTypesEnum) // Convert enum to entries (key-value pairs)
            .filter(([key, value]) => isNaN(Number(key))) // Exclude numeric keys
            .map(([key, value]) => ({
              value, // Numeric value
              display: key, // String value
            })),

          isRequired: true,
        },

        {
          name: 'isActive',
          type: 'checkbox',
          label: 'פעיל',
          value: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];
  public InfrastructureViolationTypeForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'violationTypeID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'name',
          type: 'text',
          label: 'תיאור',
          validations: {
            required: true,
            maxLength: 150,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          type: 'selectWithLookup',
          name: 'ticketTypeID',
          label: 'משויך לסוג דוח',
          value: '',
          dataFunction: {
            name: 'getTicketLookups', //ticketTypes
            objName: 'ticketTypes',
          },
          isMultiSelect: false,
          options: [],
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'automationCode',
          type: 'text',
          label: 'קוד לאוטומציה',
          validations: { maxLength: 5, pattern: '^\\d+$' },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'magakInterfaceCode',
          type: 'text',
          label: 'קוד ממשק למג"ק',
          validations: { maxLength: 5 },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'metroparkInterfaceCode',
          type: 'text',
          label: 'קוד ממשק מטרופארק',
          validations: { maxLength: 5 },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public InfrastructureTicketsSourceForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'deliveryMethodID',
          type: 'text',
          label: 'קוד',
          value: 0,
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          type: 'selectWithLookup',
          name: 'ticketSourceID',
          label: 'מקור קבלת הדוח',
          value: '',
          dataFunction: {
            name: 'getTicketLookups',
            objName: 'ticketResources',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          options: [],
          isMultiSelect: false,
        },
        {
          type: 'text',
          name: 'ticketTypeName',
          label: 'סוג הדוח',
          value: '',

          hide: false,
          disabled: true,
          size: DynamicFieldSize.Regular,
          isMultiSelect: false,
        },
        {
          type: 'text',
          name: 'ticketTypeID',
          label: 'סוג הדוח',
          value: '',
          hide: true,
          disabled: true,
          size: DynamicFieldSize.Regular,
          isMultiSelect: false,
        },
      ],
    },
    {
      row: [
        {
          name: 'deliveryMethodTypeID',
          type: 'selectWithLookup',
          label: 'שיטת מסירה',
          dataFunction: {
            name: 'getDeliveryMethodsTypes',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isMultiSelect: false,
        },
        {
          name: 'ticketStageID',
          type: 'selectWithLookup',
          label: 'העברה לשלב',
          dataFunction: {
            name: 'getTicketLookups',
            objName: 'ticketStages',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isMultiSelect: false,
        },
      ],
    },
  ];

  public InfrastructureCitizensForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'citizenCode',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          type: 'text',
          name: 'nid',
          label: 'ת.ז',
          value: '',
          hide: false,
          validations: {
            pattern: '^[0-9]{9}$',
            required: true,
          },
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          type: 'text',
          name: 'firstName',
          label: 'שם פרטי',
          value: '',
          validations: {
            pattern: '^[A-Za-zא-ת,.]+$',
            required: true,
            maxLength: 50,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          type: 'text',
          name: 'lastName',
          label: 'שם משפחה',
          value: '',
          validations: {
            pattern: '^[A-Za-zא-ת,.]+$',
            required: true,
            maxLength: 50,
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
          name: 'city',
          type: 'text',
          label: 'ישוב',
          validations: {
            required: true,
            pattern: '^[A-Za-zא-ת]+(?: [A-Za-zא-ת]+)*$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'street',
          type: 'text',
          label: 'רחוב',
          validations: {
            required: true,
            pattern: '^[A-Za-zא-ת]+(?: [A-Za-zא-ת]+)*$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'houseNumber',
          type: 'number',
          label: 'מספר בית',
          validations: {
            required: true,
            pattern: '^\\d+$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'entrance',
          type: 'number',
          label: 'כניסה',
          validations: {
            maxLength: 5,
            pattern: '^\\d+$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'apartment',
          type: 'number',
          label: 'דירה',
          validations: {
            maxLength: 5,
            pattern: '^\\d+$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'mailBox',
          type: 'text',
          label: 'ת.ד',
          validations: {
            maxLength: 7,
            pattern: /^\d+$/,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'מיקוד',
          validations: {
            maxLength: 10,
            pattern: '^\\d+$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'phone',
          type: 'text',
          label: 'טלפון',
          validations: { pattern: '^0[23489]-d{7}$' },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'phone',
          type: 'text',
          label: 'טלפון נייד',
          validations: { pattern: '^(05[0-9])(-)?[0-9]{7}$' },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'email',
          type: 'text',
          label: 'מייל',
          validations: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
          },
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];
  public InfrastructureStreetsForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'streetCode',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'streetName',
          type: 'text',
          label: 'שם רחוב',
          value: '',
          validations: {
            required: true,
            maxLength: 150,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'area',
          type: 'selectWithLookup',
          options: [],
          label: 'שיוך לאזור תו דייר',
          value: 0,
          validations: {},
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
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
      ],
    },
    {
      row: [
        {
          name: 'AssociationSupervisionArea',
          type: 'selectWithLookup',
          label: 'שיוך לאזור פיקוח',
          value: 0,
          validations: {},
          disabled: false,
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
        },
        {
          name: 'previousStreetName',
          type: 'text',
          label: 'שם הרחוב הקודם',
          value: '',
          validations: { maxLength: 150 },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'evenResidenceNumbers',
          type: 'fromTo',
          label: 'מספרי בית זוגיים',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          fields: [
            { name: 'from', placeholder: 'מ-', value: '' },
            { name: 'to', placeholder: 'עד', value: '' },
          ],
        },
        {
          name: 'oddResidenceNumbers',
          type: 'fromTo',
          label: 'מספרי בית אי זוגיים',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          fields: [
            { name: 'from', placeholder: 'מ-', value: '' },
            { name: 'to', placeholder: 'עד', value: '' },
          ],
        },
      ],
    },
    {
      row: [
        {
          name: 'entitledTenantSignEvenNumbers',
          type: 'fromTo',
          label: 'זכאי לתו דייר מספרי בית  זוגיים',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          fields: [
            { name: 'from', placeholder: 'מ-', value: '' },
            { name: 'to', placeholder: 'עד', value: '' },
          ],
        },
        {
          name: 'entitledTenantSignOddNumbers',
          type: 'fromTo',
          label: 'זכאי לתו דייר מספרי בית אי זוגיים',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          fields: [
            { name: 'from', placeholder: 'מ-', value: '' },
            { name: 'to', placeholder: 'עד', value: '' },
          ],
        },
      ],
    },
    {
      row: [
        {
          name: 'parkingForbiddenHoursOne',
          type: 'fromTo',
          label: 'איסור חניה משעה',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          fields: [
            { name: 'from', placeholder: 'מ-', value: '' },
            { name: 'to', placeholder: 'עד', value: '' },
          ],
        },
        {
          name: 'parkingForbiddenHoursTwo',
          type: 'fromTo',
          label: 'איסור חניה משעה',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          fields: [
            { name: 'from', placeholder: 'מ-', value: '' },
            { name: 'to', placeholder: 'עד', value: '' },
          ],
        },
        {
          name: 'parkingForbiddenHoursThree',
          type: 'fromTo',
          label: 'איסור חניה משעה',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          fields: [
            { name: 'from', placeholder: 'מ-', value: '' },
            { name: 'to', placeholder: 'עד', value: '' },
          ],
        },
      ],
    },
    {
      row: [
        {
          name: 'transmissionToTerminal',
          type: 'radio',
          label: 'שידור למסופון',
          value: false,
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
        },
        {
          name: 'minutesContinuousParking',
          type: 'number',
          label: 'היתר דקות לחניה רצופה',
          value: '',
          validations: { pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'registeringWarningReport',
          type: 'radio',
          label: 'רישום דוח אזהרה',
          value: false,
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          isRequired: true,
        },

        {
          name: 'authorityID',
          type: 'text',
          label: 'שיוך לרחובות',
          value: '',
          validations: {},
          disabled: false,
          hide: true,
          size: DynamicFieldSize.Double,
          options: [],
          isMultiSelect: true,
        },
      ],
    },
  ];

  public InfrastructureChipsOwnerForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'chipID',
          type: 'number',
          label: 'קוד',
          value: 0,
          // validations: { pattern: /^\d+$/ },
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'chipNumber',
          type: 'number',
          label: 'שבב',
          value: 0,
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'ownerID',
          type: 'text',
          label: 'ת.ז',
          value: '',
          validations: { pattern: '^[0-9]{9}$', required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'firstName',
          type: 'text',
          label: 'שם פרטי',
          value: '',
          validations: {
            maxLength: 50,
            required: true,
            pattern: '^[A-Za-zא-ת,.]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'lastName',
          type: 'text',
          label: 'שם משפחה',
          value: '',
          validations: {
            maxLength: 50,
            required: true,
            pattern: '^[A-Za-zא-ת,.]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'city',
          type: 'selectWithLookup',
          label: 'עיר',
          value: null,
          validations: {
            required: true,
          },
          options: [],
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getCities',
          },
          isRequired: true,
        },
        {
          name: 'streetID',
          type: 'selectWithLookup',
          label: 'רחוב',
          value: null,
          validations: {
            required: true,
          },
          options: [],
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getStreets',
            extraParams: [
              {
                connectedField: 'city',
                paramName: 'city',
              },
            ],
          },
          isRequired: true,
        },
        {
          name: 'houseNumber',
          type: 'number',
          label: 'מספר בית',
          value: null,
          validations: {
            required: true,
            maxLength: 10,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'entrance',
          type: 'text',
          label: 'כניסה',
          value: '',
          validations: {
            maxLength: 10,
            pattern: '^[A-Za-z0-9]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'apartment',
          type: 'text',
          label: 'דירה',
          value: '',
          validations: {
            required: true,
            maxLength: 10,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'mailbox',
          type: 'text',
          label: 'ת.ד',
          value: '',
          validations: {
            maxLength: 10,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'מיקוד',
          value: '',
          validations: {
            maxLength: 8,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'phone',
          type: 'text',
          label: 'טלפון',
          value: '',
          validations: {
            maxLength: 11,
            pattern:
              '^(?:\\+972-?|0)([23489]|5[0123456789]|7[23456789])(-?\\d{7}|\\d{7})$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'alternatePhone',
          type: 'text',
          label: 'טלפון נוסף',
          value: '',
          validations: {
            maxLength: 11,
            pattern:
              '^(?:\\+972-?|0)([23489]|5[0123456789]|7[23456789])(-?\\d{7}|\\d{7})$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'addressId',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: false,
          hide: true,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public InfrastructureChipsPetForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'breed',
          type: 'text',
          label: 'גזע',
          value: '',
          validations: {
            maxLength: 100,
            required: true,
            pattern: '^[A-Za-zא-ת,. ]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'color',
          type: 'text',
          label: 'צבע',
          value: '',
          validations: {
            maxLength: 100,
            required: true,
            pattern: '^[A-Za-zא-ת,.]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          name: 'animalName',
          type: 'text',
          label: 'שם בעל החיים',
          value: '',
          validations: {
            maxLength: 50,
            required: true,
            pattern: '^[A-Za-zא-ת,.]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          name: 'genderId',
          type: 'radio',
          label: 'מין',
          value: '',
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          options: [
            { display: 'זכר', value: 1 },
            { display: 'נקבה', value: 2 },
          ],
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'previousVaccinationDate',
          type: 'date',
          label: 'תאריך חיסון קודם',
          value: '',
          validations: { required: false },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'lastVaccinationDate',
          type: 'date',
          label: 'תאריך חיסון אחרון',
          value: '',
          validations: { required: false },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'veterinarianName',
          type: 'text',
          label: 'שם וטרינר',
          value: '',
          validations: {
            maxLength: 100,
            pattern: '^[A-Za-zא-ת ,.]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'veterinarianLicenseNumber',
          type: 'text',
          label: 'מספר רשיון וטרינרי',
          value: '',
          validations: {
            maxLength: 15,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'animalBirthDate',
          type: 'date',
          label: 'תאריך לידה',
          value: '',
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'animalNumber',
          type: 'number',
          label: 'מספר בעל חי',
          value: 0,
          validations: {
            maxLength: 20,
            pattern: '^\\d+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'animalStatusId',
          type: 'select',
          label: 'בע"ח סטטוס',
          value: 0,
          validations: {},
          disabled: false,
          hide: false,
          options: Object.entries(AnimalStatusEnum) // Convert enum to entries (key-value pairs)
            .filter(([key, value]) => isNaN(Number(key))) // Exclude numeric keys
            .map(([key, value]) => ({
              value, // Numeric value
              display: key.replace(/_/g, ' '), // Replace underscores with spaces in the key
            })),

          size: DynamicFieldSize.Regular,
        },

        {
          name: 'notificationSentDate',
          type: 'date',
          label: 'תאריך משלוח התראה',
          value: '',
          validations: { required: false },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public InfrastructurePlaintiffsCausesForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'reservedRemarkID',
          type: 'number',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'remark',
          type: 'text',
          label: 'תיאור העילה',
          value: '',
          validations: {
            required: true,
            maxLength: 500,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },

        {
          name: 'relatedGroup',
          type: 'select',
          label: 'שיוך לקבוצת החלטה',
          value: 0,
          validations: {
            required: false,
          },
          options: Object.entries(RelatedGroupEnum) // Convert enum to entries (key-value pairs)
            .filter(([key, value]) => isNaN(Number(key))) // Exclude numeric keys
            .map(([key, value]) => ({
              value, // Numeric value
              display: key.replace(/_/g, ' '), // Replace underscores with spaces in the key
            })),
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'decisionCode',
          type: 'number',
          label: 'החלטה',
          value: '',
          validations: {
            required: true,
            maxLength: 5,
            pattern: '^[0-9]+$',
          },
          isRequired: true,
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'parkingMailCode',
          type: 'number',
          label: 'קוד מכתב חניה',
          value: '',
          validations: {
            maxLength: 5,
            pattern: '^[0-9]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'generalMailCode',
          type: 'number',
          label: 'קוד מכתב כללי',
          value: '',
          validations: {
            maxLength: 5,
            pattern: '^[0-9]+$',
            required: false,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'adminMailCode',
          type: 'number',
          label: 'קוד מכתב מנהלי',
          value: '',
          validations: {
            maxLength: 5,
            pattern: '^[0-9]+$',
            required: false,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'isPrintOnTicket',
          type: 'radio',
          label: 'האם להדפיס ספח שובר',
          value: '',
          validations: { required: true },
          disabled: false,
          hide: false,
          options: [
            { value: true, display: 'כן' },
            { value: false, display: 'לא' },
          ],
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'סטטוס עילה',
          value: true,
          placeholder: 'פעיל',
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          name: 'ticketType',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getTicketLookups',
            objName: 'ticketTypes',
          },
          options: [],
          label: 'סוג דוח',

          isMultiSelect: false,
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
  ];
  public InfrastructureAreasForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'areaID',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'areaName',
          type: 'text',
          label: 'שם אזור',
          value: '',
          validations: {
            required: true,
            maxLength: 150,
            // pattern: '^[A-Za-z0-9]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'parkingType',
          type: 'select',
          options: [
            { display: 'חניון', value: 1 },
            { display: 'חניה ', value: 0 },
            { display: 'עבודה ', value: 2 },
          ],
          label: 'הגדרת איזור ',
          value: '',
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },

    {
      row: [
        {
          name: 'streets',
          type: 'selectWithLookup',
          label: 'שיוך לרחובות',
          value: '',
          validations: {},
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          options: [],
          isMultiSelect: true,
          bindLabelKey: 'value',
          bindValueKey: '',
          dataFunction: {
            name: 'getStreets',

            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityIDs',
              },
            ],
          },
        },
        {
          name: 'linkedInspectors',
          type: 'selectWithLookup',
          label: 'קישור לקבוצת פקחים ',
          value: '',
          validations: {},
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isMultiSelect: true,
          options: [],
          bindLabelKey: 'value',
          bindValueKey: '',
          dataFunction: {
            name: 'getAllInspectors',
          },
        },
      ],
    },
  ];

  public InfrastructureSignsForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'id',
          type: 'number',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          type: 'text',
          name: 'signNumber',
          label: 'מספר שלט',
          value: '',
          hide: false,
          validations: {
            maxLength: 50,
            pattern: /^\d+$/,
          },

          size: DynamicFieldSize.Regular,
        },

        {
          type: 'text',
          name: 'signDescription',
          label: 'תיאור השלט',
          value: '',
          validations: {
            maxLength: 150,
            required: true,
            pattern: /^[\u0590-\u05FFa-zA-Z0-9\s]{1,150}$/,
          },
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'area',
          type: 'number',
          label: 'שטח שלט',
          value: 0,
          validations: {
            maxLength: 5,
            pattern: /^\d+(\.\d+)?$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'length',
          type: 'number',
          label: 'אורך השלט',
          value: 0,
          validations: {
            maxLength: 5,
            pattern: /^\d+(\.\d+)?$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'width',
          type: 'number',
          label: 'רוחב השלט',
          value: 0,
          validations: {
            maxLength: 5,
            pattern: /^\d+(\.\d+)?$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          type: 'radio',
          name: 'isActive',
          label: 'סטטוס שלט ',
          value: true,
          validations: { required: true },
          options: [
            { value: true, display: 'פעיל' },
            { value: false, display: 'לא פעיל' },
          ],
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'latitude',
          type: 'number',
          label: 'מיקום השלט',
          placeholder: 'LAT',
          value: 0,
          validations: {},
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Small,
        },
        {
          name: 'longitude',
          type: 'number',
          label: '',
          placeholder: 'LONG',
          value: 0,
          validations: {},
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Small,
        },
        {
          name: 'cityID',
          type: 'selectWithLookup',
          label: 'יישוב השלט',
          options: [],
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getCities',
          },
          isRequired: true,
        },

        {
          name: 'streetID',
          type: 'selectWithLookup',
          label: 'רחוב השלט',
          validations: { required: true },
          disabled: false,
          hide: false,
          options: [],
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getStreets',
            extraParams: [
              {
                connectedField: 'cityID',
                paramName: 'cityIDs',
              },
            ],
          },
          isRequired: true,
        },

        {
          name: 'houseNumber',
          type: 'text',
          label: 'מספר בית שלט',
          value: '',
          validations: {
            pattern: /^\d+$/,
            maxLength: 10,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },

    {
      row: [
        {
          name: 'businessName',
          type: 'text',
          label: 'שם העסק',
          value: '',
          validations: {
            maxLength: 150,
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },

        {
          name: 'cn',
          type: 'text',
          label: 'ח.פ עסק',
          value: '',
          validations: {
            pattern: '^(5\\d{8}|[6-9]\\d{8})$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'businessCity',
          type: 'selectWithLookup',
          label: 'יישוב העסק',
          value: '',
          validations: {},
          options: [],
          disabled: false,
          hide: false,
          isMultiSelect: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getCities',
          },
        },
      ],
    },

    {
      row: [
        {
          name: 'businessStreet',
          type: 'selectWithLookup',
          label: 'רחוב העסק',
          value: '',
          validations: {},
          options: [],
          disabled: false,
          hide: false,
          isMultiSelect: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getStreets',
            extraParams: [
              {
                connectedField: 'businessCity',
                paramName: 'cityIDs',
              },
            ],
          },
        },
        {
          name: 'businessHouseNumber',
          type: 'text',
          label: 'מספר בית עסק',
          value: '',
          validations: {
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },

    {
      row: [
        {
          name: 'nid',
          type: 'text',
          label: 'ת.ז בעל השלט',
          value: '',
          validations: {
            pattern: '^[0-9]{9}$',
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'citizenFirstName',
          type: 'text',
          label: 'שם פרטי',
          value: '',
          validations: {
            maxLength: 50,
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'citizenLastName',
          type: 'text',
          label: 'שם משפחה',
          value: '',
          validations: {
            maxLength: 50,
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          name: 'citizenCity',
          type: 'selectWithLookup',
          label: 'יישוב בעל השלט',
          value: '',
          validations: { required: true },
          options: [],
          disabled: false,
          hide: false,
          isMultiSelect: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getCities',
          },

          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'citizenStreet',
          type: 'selectWithLookup',
          label: 'רחוב בעל השלט',
          value: '',
          validations: {},
          options: [],
          disabled: false,
          hide: false,
          isMultiSelect: false,
          size: DynamicFieldSize.Regular,
          dataFunction: {
            name: 'getStreets',
            extraParams: [
              {
                connectedField: 'citizenCity',
                paramName: 'citizenCity',
              },
            ],
          },
        },
        {
          name: 'citizenHouseNumber',
          type: 'text',
          label: 'מספר בית',
          value: '',
          validations: {
            maxLength: 5,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'citizenPhones',
          type: 'text',
          label: 'טלפון בעל העסק',
          value: '',
          validations: {
            maxLength: 10,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'citizenAddresses',
          type: 'text',
          label: 'ת.ד',
          value: '',
          validations: {
            maxLength: 7,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];
  public InfrastructureViolationProcessTypeForm: DynamicRow[] = [
    {
      row: [{
        name: 'ViolationProcessType',
        type: 'select',
        label: 'תהליכים',
        options: [
          { display: 'basic', value: 'basic' },
          { display: 'parkingPermit', value: 'parkingPermit' },
          { display: 'cellular', value: 'cellular' },
          { display: 'handicap', value: 'handicap' }
        ],
        value: '',
        validations: {

        },
        isMultiSelect:true,
        disabled: false,
        hide: false,
        size: DynamicFieldSize.Regular,
      }]
    }
  ]
  public InfrastructureViolationForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'violationCode',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'violationCode',
          type: 'number',
          label: 'סיווג עבירה',
          value: '',
          validations: {},
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'description',
          type: 'text',
          label: 'תיאור עבירה',
          value: '',
          validations: { maxLength: 500, required: true },
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
          name: 'shortDescription',
          type: 'text',
          label: 'תיאור עבירה קצר',
          value: '',
          validations: { maxLength: 500 },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'ticketTypeID',
          type: 'selectWithLookup',
          dataFunction: {
            name: 'getTicketLookups',
            objName: 'ticketTypes',
          },
          options: [],
          label: 'סוג דוח',

          isMultiSelect: false,
          validations: { required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          name: 'violationTypeCode',
          type: 'text',
          label: 'קוד סוג עבירה',
          value: '',
          validations: { maxLength: 5, required: true, pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'violationClause',
          type: 'text',
          label: 'סעיף עבירה',
          value: '',
          validations: { maxLength: 20, required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'fineAmount',
          type: 'number',
          label: 'סכום קנס מקור',
          value: '',
          validations: { maxLength: 20, required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'courtCaseTypeCode',
          type: 'text',
          label: 'קוד סוג תיק בית משפט',
          value: '',
          validations: { maxLength: 5, pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'photoRequired',
          type: 'radio',
          label: 'חובת תמונה',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'remarkRequired',
          type: 'radio',
          label: 'חובת הערה',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'canIssueWarning',
          type: 'radio',
          label: 'האם ניתן לכתוב אזהרה',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'automationCode',
          type: 'text',
          label: 'קוד לאוטומציה',
          value: '',
          validations: { maxLength: 20, pattern: '^\\d+$' },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'metropolinetCode',
          type: 'text',
          label: 'קוד מטרופארק',
          value: '',
          validations: { maxLength: 20 },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'disabledBadge',
          type: 'radio',
          label: 'תו נכה',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'isPersonalIDRequired',
          type: 'radio',
          label: 'חובת תעודת זהות',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'isLicenseNumberRequired',
          type: 'radio',
          label: 'חובת הכנסת מספר רישוי',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'isCompanyIDRequired',
          type: 'radio',
          label: 'חובה ח.פ/זהות',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'printCount',
          type: 'number',
          label: 'מספר עותקים',
          value: '',
          validations: { maxLength: 20 },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'createReportLater',
          type: 'radio',
          label: 'הקמת דוח אמת לאחר פרק זמן',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'warningOption',
          type: 'radio',
          label: 'אפשרות לרישום אזהרה',
          options: [
            { display: 'כן', value: true },
            { display: 'לא', value: false },
          ],
          value: false,
          validations: {
            required: true,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'handheldWorkMethod',
          type: 'select',
          label: 'שיטת עבודה עם מסופון',
          value: '',
          validations: { required: true },
          options: [
            { display: 'מדפסת', value: 0 },
            { display: 'QA', value: 1 },
            { display: 'גם וגם', value: 2 },
          ],
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'handheldComment',
          type: 'text',
          label: 'הערת מסופון',
          value: '',
          validations: { maxLength: 20, required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
        {
          name: 'notificationCode',
          type: 'number',
          label: 'קוד התראה',
          value: 1,
          validations: { maxLength: 20 },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'reportType',
          type: 'number',
          label: 'קוד עבירה',
          value: '',
          validations: { maxLength: 5, required: true },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
  ];

  public InfrastructureBusinessForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'id',
          type: 'text',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          type: 'text',
          name: 'identification',
          label: 'ח.פ',
          value: '',
          validations: {
            required: true,
            pattern: /^[0-9]{9}$|^[A-Za-z0-9]{1,9}$/,
          },
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },

        {
          type: 'text',
          name: 'businessName',
          label: 'שם העסק',
          value: '',
          validations: {
            required: true,
            maxLength: 150,
          },
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },
      ],
    },
    {
      row: [
        {
          name: 'city',
          type: 'text',
          label: 'ישוב',
          value: '',
          validations: {
            required: true,
            maxLength: 150,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'street',
          type: 'text',
          label: 'רחוב',
          value: '',
          validations: {
            required: true,
            maxLength: 150,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Double,
          isRequired: true,
        },

        {
          name: 'houseNumber',
          type: 'text',
          label: 'מספר בית ',
          value: '',
          validations: {
            maxLength: 10,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
    {
      row: [
        {
          name: 'entrance',
          type: 'text',
          label: 'כניסה',
          value: '',
          validations: {
            maxLength: 5,
            pattern: '^[A-Za-z0-9]+$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'apartment',
          type: 'text',
          label: 'דירה',
          value: '',
          validations: {
            maxLength: 5,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'poBox',
          type: 'text',
          label: 'ת.ד',
          value: '',
          validations: {
            maxLength: 7,
            pattern: /^\d+$/,
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'מיקוד',
          value: '',
          validations: { maxLength: 10, pattern: /^\d+$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },

    {
      row: [
        {
          name: 'phone',
          type: 'text',
          label: 'טלפון',
          value: '',
          validations: { pattern: /^0([2-9])(?!5)(\d{7})$/ },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'mobilePhone',
          type: 'text',
          label: 'טלפון נייד',
          value: '',
          validations: { pattern: '^(05[0-9])(-)?[0-9]{7}$' },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },

        {
          name: 'email',
          type: 'text',
          label: ' מייל',
          value: '',
          validations: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
      ],
    },
  ];

  public InfrastructureTollsForm: DynamicRow[] = [
    {
      row: [
        {
          name: 'id',
          type: 'number',
          label: 'קוד',
          value: '',
          validations: {},
          disabled: true,
          hide: false,
          size: DynamicFieldSize.Regular,
        },
        {
          name: 'description',
          type: 'text',
          label: 'תיאור אגרה',
          value: '',
          validations: { maxLength: 150, required: true },
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
          name: 'feeTypeId',
          type: 'select',
          label: 'סוג אגרה',
          value: '',
          validations: { required: true },
          options: [
            { display: 'הודעת דרישה טופס 1', value: 1 },
            { display: 'טופס 3', value: 2 },
            { display: 'תזכורת חוב', value: 3 },
            { display: 'אגרת עיקול בנק', value: 4 },
            {
              display: 'אגרת עיקול מיטלטלין ברישום',
              value: 5,
            },
            {
              display: 'אגרת עיקול מטלטלין בפועל',
              value: 6,
            },
            { display: "אגרת עיקול צד ג'	", value: 7 },
            { display: 'אגרת מימוש לבנק', value: 8 },
            { display: 'אגרת עיקול רכב', value: 9 },
          ],
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
        {
          name: 'price',
          type: 'number',
          label: 'סכום אגרה',
          // value: 0,
          validations: {
            required: true,
            pattern: '^(?:0|0.[0-9]{1,2}|[1-9][0-9]*(?:.[0-9]{1,2})?)$',
          },
          disabled: false,
          hide: false,
          size: DynamicFieldSize.Regular,
          isRequired: true,
        },
      ],
    },
  ];
}

export const InfrastructureSpecialTableTypes: SpecialTableTypes[] = [
  { display: 'נכה', value: InfrastructureTablesTypes.Disabled },
  { display: 'רכבים מיוחדים', value: InfrastructureTablesTypes.Public },
];
