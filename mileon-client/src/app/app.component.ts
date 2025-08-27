import { Component, input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from './constants/const_path';
import {
  BaseComponents,
  SharedImports,
  SharedModules,
} from './shared/shared-modules';
import { FormGroup, FormControl } from '@angular/forms';
import { Column, ColumnTypeEnum } from './types/table';
import { Subject } from 'rxjs';
import { Icon } from './types/icon';
import { AppService } from './app.service';
import { PreviewFileType } from './types/previewFile';
import { InputSizeEnum } from './types/enum/inputSizeEnum';
import { AdvancedForm, FieldTypeEnum, FieldLengthEnum , FieldSize } from './types/advanced-search/form-tab.model';
import { ConfirmationModalComponent } from "./components/shared/confirmation-modal/confirmation-modal.component";
import { AppModalComponent } from "./components/shared/app-modal/app-modal.component";
import { InfrastructureService as InfrastructureDataService } from './components/infrastractures/infrastructure.service';
import { ModalButton } from './components/shared/generic-modal/generic-modal.component';
import { InfrastructureFormComponent } from './components/infrastractures/infrastructure-form/infrastructure-form.component';
import { InfrastructureForms, InfrastructureTable } from './types/infrastructure/infrastructure-table.model';
import { InfrastructureTableAction, InfrastructureTablesTypes } from './types/enum/infrastructureTablesEnum';
import { StreetsTypes } from './types/infrastructure/infrastructureFilterOptions';
import { ErrorSuccessMessages } from './types/enum/error-success-messages';
import { InfrastructureExportComponent } from './components/infrastractures/infrastructure-export/infrastructure-export.component';
import { MatDialog } from '@angular/material/dialog';
import { InfrastructureImportComponent } from './components/infrastractures/infrastructure-import/infrastructure-import.component';
import { DynamicRow } from './types/infrastructure/InfrastructureTypes';
import { InfrastructuresFormWrapperComponent } from './components/infrastractures/infrastructures-form-wrapper/infrastructures-form-wrapper.component';
import { TagComponent } from "./components/shared/base/tag/tag.component";
import { TicketsTableNewComponent } from "./components/tickets-new/tickets-table-new/tickets-table-new.component";
import { TableComponent } from "./components/shared/table/table.component";
import { TicketIcons } from './types/ticket/ticket-icons.model';
import { TicketNew } from './types/ticket';
import { TicketFilterOptions } from './types/filters/ticket/ticketFilterOptions';
import { TicketsService } from './components/tickets-new/tickets.service'; 
// import { ActionButtonsComponent } from './components/shared/action-buttons/action-buttons.component';
import { ActionButtonNames } from './constants/action_buttons';
import { TicketTimelineBarComponent } from "./components/authority-management/timeline/ticket-timeline-bar/ticket-timeline-bar.component";
import { TimelineItem } from './types/timeline-settings/timeline-settings-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
    imports: [
    BaseComponents,
    SharedImports,
    ConfirmationModalComponent,
    AppModalComponent,
    TagComponent,
    TicketsTableNewComponent,
    TicketTimelineBarComponent
], 
})
export class AppComponent {
  dialogData: DynamicRow[] = [];
  ownerDialogData: DynamicRow[] = [];
  petDialogData: DynamicRow[] = [];
  tableData: InfrastructureTable[] = [];
  isSaveModalOpen = false;
  filesToUpload: any[] = [];  
  InputSizeEnum = InputSizeEnum;
  FieldTypeEnum = FieldTypeEnum;
  FieldLengthEnum = FieldLengthEnum;
  FieldSize = FieldSize;

  selectedUserData: Subject<any> = new Subject<any>();
  loader: boolean = false;
  showPaginator: boolean = true;

  TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;
  
  selectedFiles: any[] = [];

  form: FormGroup = new FormGroup({});
  pageSize: number = 100;


  steps: TimelineItem[] = [
    {
      order: 1,
      text: 'התראה',
      imgSrc: 'car.svg',
      path: '/stage1',
      validateFields: ['field1', 'field2'],
      errors: 0,
      isUpdated: false,
      seen: true,
      updatedCount: 0,
      description: 'שלב ראשון - התראה ראשונית',
      title: 'התראה',
      isMoveable: false,
      iconId: 1,
      enumName: 'WARNING',
      isActive: true
    },
    {
      order: 2,
      text: 'אירוע',
      imgSrc: 'bus.svg',
      path: '/stage2',
      validateFields: ['field3', 'field4'],
      errors: 0,
      isUpdated: false,
      seen: false,
      updatedCount: 0,
      description: 'שלב שני - טיפול באירוע',
      title: 'אירוע',
      isMoveable: false,
      iconId: 2,
      enumName: 'EVENT',
      isActive: false
    },
    {
      order: 3,
      text: 'דו"ח חלון',
      imgSrc: 'building.svg',
      path: '/stage3',
      validateFields: ['field5', 'field6'],
      errors: 0,
      isUpdated: false,
      seen: false,
      updatedCount: 0,
      description: 'שלב שלישי - דוח חלון',
      title: 'דו"ח חלון',
      isMoveable: false,
      iconId: 3,
      enumName: 'WINDOW_REPORT',
      isActive: false
    },
    {
      order: 4,
      text: 'הלבשה משרד התחבורה',
      imgSrc: 'danger.svg',
      path: '/stage4',
      validateFields: ['field7', 'field8'],
      errors: 0,
      isUpdated: false,
      seen: false,
      updatedCount: 0,
      description: 'שלב רביעי - הלבשה משרד התחבורה',
      title: 'הלבשה משרד התחבורה',
      isMoveable: false,
      iconId: 4,
      enumName: 'TRANSPORT_MINISTRY',
      isActive: false
    },
    {
      order: 5,
      text: 'הלבשה משרד הפנים',
      imgSrc: 'judgeYellow.svg',
      path: '/stage5',
      validateFields: ['field9', 'field10'],
      errors: 0,
      isUpdated: false,
      seen: false,
      updatedCount: 0,
      description: 'שלב חמישי - הלבשה משרד הפנים',
      title: 'הלבשה משרד הפנים',
      isMoveable: false,
      iconId: 5,
      enumName: 'INTERIOR_MINISTRY',
      isActive: false
    },
    {
      order: 6,
      text: 'הודעת תשלום',
      imgSrc: 'bank.svg',
      path: '/stage6',
      validateFields: ['field11', 'field12'],
      errors: 0,
      isUpdated: false,
      seen: false,
      updatedCount: 0,
      description: 'שלב שישי - הודעת תשלום',
      title: 'הודעת תשלום',
      isMoveable: false,
      iconId: 6,
      enumName: 'PAYMENT_NOTICE',
      isActive: false
    },
    {
      order: 7,
      text: 'אכיפה - טופס 1',
      imgSrc: 'glass.svg',
      path: '/stage7',
      validateFields: ['field13', 'field14'],
      errors: 0,
      isUpdated: false,
      seen: false,
      updatedCount: 0,
      description: 'שלב שביעי - אכיפה טופס 1',
      title: 'אכיפה - טופס 1',
      isMoveable: false,
      iconId: 7,
      enumName: 'ENFORCEMENT_FORM1',
      isActive: false
    }
  ];
  isFirstTime: boolean = true;

  // actionButtonsComponent: ActionButtonsComponent;

  selectedTicketData$: Subject<TicketNew> = new Subject<TicketNew>();

  actionButtonsList: ActionButtonNames[] = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
  ];



  
  // Generate suggestions from the data
  searchSuggestions: string[] = [];
  modalButtons: ModalButton[] = [
    {
      label: 'סגור',
      action: () => this.closeModal(),
      buttonClass: 'primary-btn button-base'
    }
  ];
  previewFile: PreviewFileType | undefined;
  searchText: string = '';
  newComment: any;

  

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private dialog: MatDialog,
    private infrastructureDataService: InfrastructureDataService,
    private ticketsService: TicketsService,
  ) {}




  openSaveModal() {
    this.isSaveModalOpen = true;
  }

  isConfirmationModalOpen = false;
  
  openConfirmationModal() {
    this.isConfirmationModalOpen = true;
  }
  

  closeModal() {
    this.isSaveModalOpen = false;
  }

  closeConfirmationModal() {
    this.isConfirmationModalOpen = false;
  }


  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData;
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructurePlaintiffsCausesForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        data: { form: dialogData, title: 'עריכת רשומה', isEdit: isEdit, isSigns: false },
      });
      const dialogInstance = dialogRef.componentInstance;
      dialogInstance.dataSubject.subscribe((result: any) => {
        const action = result.isEdit
          ? InfrastructureTableAction.Update
          : InfrastructureTableAction.Add;
        this.handleInsertOrUpdate(result.form, action);
      });
    }
  }

  async openDoubleDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructuresFormWrapperComponent;

    if (dialogComponent) {
      // Reset the dialog data if not editing
      let ownerDialogData = isEdit
        ? this.ownerDialogData
        : new InfrastructureForms().InfrastructureChipsOwnerForm;
      let petDialogData = isEdit
        ? this.petDialogData
        : new InfrastructureForms().InfrastructureChipsPetForm;

      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          mainTitle: isEdit ? 'עריכת רשומה' : 'הוספת רשומה', // Dynamic title
          sections: [
            {
              title: 'פרטי הבעלים', // Title for the owner section
              rows: ownerDialogData, // Fields for the owner section
            },
            {
              title: 'פרטי בעל חיים', // Title for the pet section
              rows: petDialogData, // Fields for the pet section
            },
          ],
          isEdit: isEdit,
        },
      });

      const dialogInstance = dialogRef.componentInstance;

      dialogInstance.dataSubject.subscribe((result) => {
        const action = result.isEdit
          ? InfrastructureTableAction.Update
          : InfrastructureTableAction.Add;
        this.handleInsertOrUpdate(result.form, action);

        console.log(result);
      });
    }
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,

        data: {
          description: 'קוד,צבע,סטטוס,קוד לאוטומציה.',
        },
      });
      const dialogInstance = dialogRef.componentInstance;
      dialogInstance.dataSubject.subscribe(() => {  
        this.infrastructureDataService.exportTableData(this.form, InfrastructureTablesTypes.Street);
        // this.infrastructureDataService.closeAllInfrastructureDialogs();
      });
    }
  }


  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          isSignsImport: false,
          description: 'קוד, שם אזור,הגדרת אזור',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.uploadedFiles) {
          this.filesToUpload = result.uploadedFiles;
        } else {
          console.log('Dialog was closed without uploading files.');
        }
      });
    }
  }
  

  async handleInsertOrUpdate(
    data: any,
    action: InfrastructureTableAction
  ) {
    try {
      const updatedObject = {
        ...data,
        streetID: data.streetID,
        authorityID: '1', // ← your authority ID
      };

      const result = await this.infrastructureDataService.insertToTypeTableDynamic(
        new StreetsTypes(updatedObject),
        InfrastructureTablesTypes.Street,
        action
      );
      if (result && result?.success) {
        // this.loadData(this.infrastructureSearchFormService.form);
        // this.dialog.closeAll();
        if (action == InfrastructureTableAction.Add) {
          this.toastr.success(ErrorSuccessMessages.ADDED_SUCCESUFULY);
        }
        if (action == InfrastructureTableAction.Update) {
          this.toastr.success(ErrorSuccessMessages.UPDATED_SUCCESUFULY);
        }
      }
    } catch (e) {
      this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.error(e);
    }
  }


  title = 'mileon-client';

  // Advanced search configuration
  advancedSearch: AdvancedForm = {
    tabs: [
      {
        name: 'basic',
        displayName: 'חיפוש בסיסי',
        rows: [
          {
            group: [
              {
                name: 'fullName',
                displayName: 'שם מלא',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                size: FieldSize.Medium
              },
              {
                name: 'nid',
                displayName: 'מספר זהות',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Short,
                size: FieldSize.Medium
              },
              {
                name: 'nidLarge',
                displayName: 'מספר זהות (ארוך)',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Long,
                size: FieldSize.Small
              },
              {
                name: 'phone',
                displayName: 'טלפון',
                type: FieldTypeEnum.Phone,
                length: FieldLengthEnum.Short,
                size: FieldSize.Small
              },
              {
                name: 'email',
                displayName: 'אימייל',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                size: FieldSize.Medium
              },
              {
                name: 'description',
                displayName: 'תיאור מפורט',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Long,
                size: FieldSize.ExtraLarge
              }
            ]
          }
        ]
      },
      {
        name: 'location',
        displayName: 'מיקום',
        rows: [
          {
            group: [
              {
                name: 'municipality',
                displayName: 'עירייה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                multipleSelect: true,
                dataFunction: {
                  name: 'getMunicipalities',
                  function: () => this.mockMunicipalities
                }
              }
            ]
          }
        ]
      },
      {
        name: 'dates',
        displayName: 'תאריכים',
        rows: [
          {
            group: [
              {
                name: 'violationDate',
                displayName: 'תאריך עבירה',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Short
              },
              {
                name: 'status',
                displayName: 'סטטוס',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Short,
                multipleSelect: false,
                dataFunction: {
                  name: 'getStatuses',
                  function: () => this.mockStatuses
                }
              }
            ]
          }
        ]
      }

    ]
  };
  


  // columns: Column[] = [
  //   {
  //     propertyName: 'selected',
  //     displayName: 'בחירה',
  //     type: ColumnTypeEnum.Checkbox,
  //     canSort: false,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'status',
  //     displayName: 'סטטוס',
  //     type: ColumnTypeEnum.Tag,
  //     canSort: true,
  //     sortByServer: false,
  //     fieldId: 'statusId'
  //   },
  //   {
  //     propertyName: 'municipality',
  //     displayName: 'עירייה',
  //     type: ColumnTypeEnum.Text,
  //     canSort: true,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'nid',
  //     displayName: 'מספר זהות',
  //     type: ColumnTypeEnum.Text,
  //     canSort: true,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'fullName',
  //     displayName: 'שם מלא',
  //     type: ColumnTypeEnum.Text,
  //     canSort: true,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'violationDate',
  //     displayName: 'תאריך עבירה',
  //     type: ColumnTypeEnum.Date,
  //     canSort: true,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'reportNumber',
  //     displayName: 'מספר דוח',
  //     type: ColumnTypeEnum.Text,
  //     canSort: true,
  //     sortByServer: false,
  //     textOverflow: true
  //   },
  //   {
  //     propertyName: 'ticketStageName',
  //     displayName: 'שלב',
  //     type: ColumnTypeEnum.Text,
  //     canSort: true,
  //     sortByServer: false,
  //     fieldId: 'ticketStageID',
  //     hasIcon: true
  //   },
  //   {
  //     propertyName: 'inputField',
  //     displayName: 'מספר זהות',
  //     type: ColumnTypeEnum.Input,
  //     canSort: false,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'yesNoRadio',
  //     displayName: 'כן/לא',
  //     type: ColumnTypeEnum.Radio,
  //     canSort: false,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'additionalReports',
  //     displayName: 'דוחות נוספים',
  //     type: ColumnTypeEnum.Currency,
  //     canSort: true,
  //     sortByServer: false
  //   },
  //   {
  //     propertyName: 'actions',
  //     displayName: 'פעולות',
  //     type: ColumnTypeEnum.Icon,
  //     canSort: false,
  //     sortByServer: false
  //   }
  // ];
  
  
  originalData: any[] = [
    {
      id: 1,
      violationDate: '2025-01-09',
      nid: '245987630',
      additionalReports: 526,
      TicketStagesIcons: this.TicketStagesIcons,
      ticketStageID: 1,
      ticketStageName: 'התראה'
    },
    {
      id: 2,
      selected: false,
      reportNumber: '1585123121595',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2026-02-25',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'אילת',
      municipalityId: 2,
      status: 'סגור',
      statusId: 1,
      additionalReports: 526,
      TicketStagesIcons: this.TicketStagesIcons,
      ticketStageID: 2,
      ticketStageName: 'אירוע'
    },
    {
      id: 3,
      selected: false,
      reportNumber: '1585123121596',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2026-03-30',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'תל אביב',
      municipalityId: 3,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 526,
      TicketStagesIcons: this.TicketStagesIcons,
      ticketStageID: 3,
      ticketStageName: 'דו"ח חלון'
    },
    {
      id: 4,
      selected: false,
      reportNumber: '1585123121597',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2026-01-01',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'קריית שמונה',
      municipalityId: 4,
      status: 'סגור',
      statusId: 1,
      additionalReports: 526,
      TicketStagesIcons: this.TicketStagesIcons,
      ticketStageID: 4,
      ticketStageName: 'הלבשה משרד התחבורה'
    },
    {
      id: 1,
      violationDate: '2025-01-09',
      nid: '245987630',
      additionalReports: 526,
      TicketStagesIcons: this.TicketStagesIcons,
      ticketStageID: 5,
      ticketStageName: 'הלבשה משרד הפנים'
    },
    {
      id: 1,
      violationDate: '2025-01-09',
      nid: '245987630',
      additionalReports: 526,
      TicketStagesIcons: this.TicketStagesIcons,
      ticketStageID: 6,
      ticketStageName: 'הודעת תשלום'
    },
    {
      id: 1,
      violationDate: '2025-01-09',
      nid: '245987630',
      additionalReports: 526,
      TicketStagesIcons: this.TicketStagesIcons,
      ticketStageID: 7,
      ticketStageName: 'אכיפה - טופס 1'
    },
  ];

  list: TicketNew[] = [...this.originalData];

  count: number = 0;
  
  
  data: any[] = [...this.originalData];

  
  total: number = 0;
  

  
  Icons = ConstPath;

  // Mock data for select components
  mockPhoneNumbers = [
    { id: 1, value: '050-1234567', label: '050-1234567' },
    { id: 2, value: '052-9876543', label: '052-9876543' },
    { id: 3, value: '054-5555555', label: '054-5555555' },
    { id: 4, value: '053-1111111', label: '053-1111111' },
    { id: 5, value: '058-9999999', label: '058-9999999' },
    { id: 6, value: '050-7777777', label: '050-7777777' },
    { id: 7, value: '052-3333333', label: '052-3333333' },
    { id: 8, value: '054-8888888', label: '054-8888888' }
  ];

  mockMunicipalities = [
    { id: 1, value: 'באר שבע', label: 'באר שבע' },
    { id: 2, value: 'אילת', label: 'אילת' },
    { id: 3, value: 'תל אביב', label: 'תל אביב' },
    { id: 4, value: 'קריית שמונה', label: 'קריית שמונה' },
    { id: 5, value: 'דימונה', label: 'דימונה' },
    { id: 6, value: 'חיפה', label: 'חיפה' },
    { id: 7, value: 'נתניה', label: 'נתניה' },
    { id: 8, value: 'ראשון לציון', label: 'ראשון לציון' },
    { id: 9, value: 'מודיעין', label: 'מודיעין' },
    { id: 10, value: 'קיסריה', label: 'קיסריה' },
    { id: 11, value: 'ירושלים', label: 'ירושלים' },
    { id: 12, value: 'אשדוד', label: 'אשדוד' },
    { id: 13, value: 'פתח תקווה', label: 'פתח תקווה' },
    { id: 14, value: 'רחובות', label: 'רחובות' },
    { id: 15, value: 'הרצליה', label: 'הרצליה' },
    { id: 16, value: 'רמת גן', label: 'רמת גן' }
  ];

  mockStatuses = [
    { id: 1, value: 'סגור', label: 'סגור' },
    { id: 2, value: 'בטיפול', label: 'בטיפול' },
    { id: 3, value: 'פתוח', label: 'פתוח' },
    { id: 4, value: 'ממתין לאישור', label: 'ממתין לאישור' },
    { id: 5, value: 'הושלם', label: 'הושלם' },
    { id: 6, value: 'ממתין xxkaxsaikwuchgdskachdiksahdcikuzjbgscdgsaueydhickzujxhc uch iujhscd  uych asauhf  hsdcujhds  shkxc dsuchkjxhyekdchzxd ffyhzkxhlzshvjdh ', label: 'ממתין לאישור' },
  ];

  // Data functions for select components
  dataFunction = {
    getPhoneNumbers: {
      name: 'getPhoneNumbers',
      function: () => this.mockPhoneNumbers
    },
    getMunicipalities: {
      name: 'getMunicipalities', 
      function: () => this.mockMunicipalities
    },
    getStatuses: {
      name: 'getStatuses',
      function: () => this.mockStatuses
    }
  };

  async loadData(filter: TicketFilterOptions) {
    this.loader = true;
    try {
      const res = await this.ticketsService.getTickets(filter);
      if (res && res.list) {
        this.list = res.list.map((p) => new TicketNew(p));
        this.total = res.list.length ? res.total : 0; 
        this.count = res.count;
      }
      if (!res?.list.length) {
        // this.actionButtonsComponent?.toggleDisabled(
        //   this.actionButtonsList,
        //   true
        // );
      }
    } catch (e) {
      console.error(e);
    }
    this.loader = false;
  }


  
  ngOnInit() {
    this.appService.currentModuleName = 'TicketsNewModule';
  
    this.form = new FormGroup({
      searchText: new FormControl(''),
      currentPage: new FormControl(1),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      orderByField: new FormControl(null),
      order: new FormControl('asc'),
      customFilters: new FormControl(null),
      phone: new FormControl(''), // Phone input
      lastUpdate: new FormControl(null), // Date input
      selectValue: new FormControl(''), // Select component
      checkboxValue: new FormControl(false), // Checkbox component
      // Advanced search form groups
      basic: new FormGroup({
        fullName: new FormControl(''),
        nid: new FormControl(''),
        nidLarge: new FormControl(''),
        comments: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        description: new FormControl('')
      }),
      location: new FormGroup({
        municipality: new FormControl(''),
        comments: new FormControl('')
      }),
      dates: new FormGroup({
        violationDate: new FormControl(null),
        status: new FormControl('')
      })
    });
    
    setTimeout(() => {
      this.loader = false;
    }, 500);
  }

  onRowEvent(event: any): void {
    if (event.action === 'edit') {
      console.log('Edit clicked for item:', event.item);
      // TODO: Implement edit functionality
      this.showSuccess(); // Show success message for now
    }
  }

  sendFormValue(searchForm: any): void {
    console.log('Search form received:', searchForm);
    const searchText = searchForm.get('searchText')?.value || '';
    console.log('Search text:', searchText);
    this.searchText = searchText;
    
    // Get advanced search values
    const basicFilters = searchForm.get('basic')?.value || {};
    const locationFilters = searchForm.get('location')?.value || {};
    const dateFilters = searchForm.get('dates')?.value || {};

    // Filter the data based on all criteria
    this.filterDataWithAdvancedSearch(searchText, basicFilters, locationFilters, dateFilters);
  }

  private filterDataWithAdvancedSearch(
    searchText: string, 
    basicFilters: any, 
    locationFilters: any, 
    dateFilters: any
  ): void {
    console.log('Filtering data with advanced search:', { searchText, basicFilters, locationFilters, dateFilters });
    
    let filteredData = [...this.originalData];
    
    // Apply basic search text filter
    if (searchText) {
      filteredData = filteredData.filter(item => 
        item.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.nid?.includes(searchText) ||
        item.municipality?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.reportNumber?.includes(searchText)
      );
    }
    
    // Apply advanced search filters
    if (basicFilters.fullName) {
      filteredData = filteredData.filter(item => 
        item.fullName?.toLowerCase().includes(basicFilters.fullName.toLowerCase())
      );
    }
    
    if (basicFilters.nid) {
      filteredData = filteredData.filter(item => 
        item.nid?.includes(basicFilters.nid)
      );
    }
    
    if (basicFilters.phone) {
      filteredData = filteredData.filter(item => 
        item.phone?.includes(basicFilters.phone)
      );
    }
    
    if (basicFilters.comments) {
      filteredData = filteredData.filter(item => 
        item.comments?.toLowerCase().includes(basicFilters.comments.toLowerCase())
      );
    }
    
    if (locationFilters.comments) {
      filteredData = filteredData.filter(item => 
        item.locationComments?.toLowerCase().includes(locationFilters.comments.toLowerCase())
      );
    }
    
    if (locationFilters.municipality) {
      // Handle both array of objects and single object from select component
      let municipalityIds: number[] = [];
      
      if (Array.isArray(locationFilters.municipality)) {
        // Multi-select: extract IDs from objects
        municipalityIds = locationFilters.municipality.map((item: any) => 
          typeof item === 'object' ? parseInt(item.id) : parseInt(item)
        );
      } else {
        // Single select: extract ID from object or use directly
        municipalityIds = [typeof locationFilters.municipality === 'object' 
          ? parseInt(locationFilters.municipality.id) 
          : parseInt(locationFilters.municipality)
        ];
      }
      
      // Filter by municipality IDs
      filteredData = filteredData.filter(item => 
        municipalityIds.includes(item.municipalityId)
      );
    }
    
    if (dateFilters.violationDate) {
      const filterDate = new Date(dateFilters.violationDate);
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.violationDate);
        return itemDate.toDateString() === filterDate.toDateString();
      });
    }
    
    if (dateFilters.status) {
      // Handle both object and direct value from select component
      let statusId: number;
      if (typeof dateFilters.status === 'object') {
        statusId = parseInt(dateFilters.status.id);
      } else {
        statusId = parseInt(dateFilters.status);
      }
      
      filteredData = filteredData.filter(item => 
        item.statusId === statusId
      );
    }
    
    // Update the data source for the table
    this.updateTableData(filteredData);
  }

  private updateTableData(newData: any[]): void {
    console.log('Updating table data:', newData.length, 'items');
    // Create a new array reference to trigger change detection
    this.data = [...newData];
    console.log('Table data updated, new length:', this.data.length);
  }

  showSuccess() {
    this.toastr.success('הפעולה הושלמה בהצלחה!');
  }
  showError() {
    this.toastr.error('משהו השתבש.');
  }

  onOptionSelected(filteredData: any[]) {
    // Update the table data with the filtered results
    this.data = filteredData;
    
    // Update search text if we have results
    if (filteredData.length > 0) {
      this.searchText = this.getDisplayText(filteredData[0]);
    }
  }

  private getDisplayText(item: any): string {
   const searchText = this.form?.get('searchText')?.value || '';
    
    if (!searchText) {
      return 'אופציה';
    }

    if (searchText === item.nid || item.nid?.includes(searchText)) {
      return item.nid;
    }
    
    if (searchText === item.municipality || item.municipality?.includes(searchText)) {
      return item.municipality;
    }
    
    if (searchText === item.reportNumber || item.reportNumber?.includes(searchText)) {
      return item.reportNumber;
    }
    
    if (searchText === item.fullName || item.fullName?.includes(searchText)) {
      return item.fullName;
    }
    
    return item.nid || item.municipality || item.reportNumber || item.fullName || 'אופציה';
  }
}
