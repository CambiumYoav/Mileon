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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    BaseComponents, 
    SharedImports, 
    ConfirmationModalComponent, 
    AppModalComponent,
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
  TicketStagesIcons: Icon[] = [];
  selectedFiles: any[] = [];

  form: FormGroup = new FormGroup({});
  pageSize: number = 100;


  
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
    private infrastructureDataService: InfrastructureDataService
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
        dialogData = form.InfrastructureTicketsSourceForm;
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
  


  columns: Column[] = [
    {
      propertyName: 'selected',
      displayName: 'בחירה',
      type: ColumnTypeEnum.Checkbox,
      canSort: false,
      sortByServer: false
    },
    {
      propertyName: 'status',
      displayName: 'סטטוס',
      type: ColumnTypeEnum.Tag,
      canSort: true,
      sortByServer: false,
      fieldId: 'statusId'
    },
    {
      propertyName: 'municipality',
      displayName: 'עירייה',
      type: ColumnTypeEnum.Text,
      canSort: true,
      sortByServer: false
    },
    {
      propertyName: 'nid',
      displayName: 'מספר זהות',
      type: ColumnTypeEnum.Text,
      canSort: true,
      sortByServer: false
    },
    {
      propertyName: 'fullName',
      displayName: 'שם מלא',
      type: ColumnTypeEnum.Text,
      canSort: true,
      sortByServer: false
    },
    {
      propertyName: 'violationDate',
      displayName: 'תאריך עבירה',
      type: ColumnTypeEnum.Date,
      canSort: true,
      sortByServer: false
    },
    {
      propertyName: 'reportNumber',
      displayName: 'מספר דוח',
      type: ColumnTypeEnum.Text,
      canSort: true,
      sortByServer: false,
      textOverflow: true
    },
    {
      propertyName: 'inputField',
      displayName: 'מספר זהות',
      type: ColumnTypeEnum.Input,
      canSort: false,
      sortByServer: false
    },
    {
      propertyName: 'yesNoRadio',
      displayName: 'כן/לא',
      type: ColumnTypeEnum.Radio,
      canSort: false,
      sortByServer: false
    },
    {
      propertyName: 'additionalReports',
      displayName: 'דוחות נוספים',
      type: ColumnTypeEnum.Currency,
      canSort: true,
      sortByServer: false
    },
    {
      propertyName: 'actions',
      displayName: 'פעולות',
      type: ColumnTypeEnum.Icon,
      canSort: false,
      sortByServer: false
    }
  ];
  
  originalData: any[] = [
    {
      id: 1,
      selected: false,
      reportNumber: '1585123121594',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-01-09',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'באר שבע',
      municipalityId: 1,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 526
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
      additionalReports: 526
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
      additionalReports: 526
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
      additionalReports: 526
    },
    {
      id: 5,
      selected: false,
      reportNumber: '1585123121598',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-11-18',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'דימונה',
      municipalityId: 5,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 526
    },
    {
      id: 6,
      selected: false,
      reportNumber: '1585123121599',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2026-03-03',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'חיפה',
      municipalityId: 6,
      status: 'סגור',
      statusId: 1,
      additionalReports: 526
    },
    {
      id: 7,
      selected: false,
      reportNumber: '1585123121600',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-08-15',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'נתניה',
      municipalityId: 7,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 526
    },
    {
      id: 8,
      selected: false,
      reportNumber: '1585123121601',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-09-22',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'ראשון לציון',
      municipalityId: 8,
      status: 'סגור',
      statusId: 1,
      additionalReports: 526
    },
    {
      id: 9,
      selected: false,
      reportNumber: '1585123121602',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-10-07',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'מודיעין',
      municipalityId: 9,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 526
    },
    {
      id: 10,
      selected: false,
      reportNumber: '1585123121603',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-12-12',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'קיסריה',
      municipalityId: 10,
      status: 'סגור',
      statusId: 1,
      additionalReports: 526
    },
    {
      id: 11,
      selected: false,
      reportNumber: '1585123121604',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-11-18',
      fullName: 'שרה כהן',
      nid: '123456789',
      municipality: 'תל אביב',
      municipalityId: 3,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 342
    },
    {
      id: 12,
      selected: false,
      reportNumber: '1585123121605',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-10-25',
      fullName: 'משה לוי',
      nid: '987654321',
      municipality: 'חיפה',
      municipalityId: 6,
      status: 'סגור',
      statusId: 1,
      additionalReports: 189
    },
    {
      id: 13,
      selected: false,
      reportNumber: '1585123121606',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-09-30',
      fullName: 'רחל גולדברג',
      nid: '456789123',
      municipality: 'ירושלים',
      municipalityId: 11,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 567
    },
    {
      id: 14,
      selected: false,
      reportNumber: '1585123121607',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-08-14',
      fullName: 'דוד רוזן',
      nid: '789123456',
      municipality: 'באר שבע',
      municipalityId: 1,
      status: 'סגור',
      statusId: 1,
      additionalReports: 234
    },
    {
      id: 15,
      selected: false,
      reportNumber: '1585123121608',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-07-22',
      fullName: 'מיכל שפירא',
      nid: '321654987',
      municipality: 'אשדוד',
      municipalityId: 12,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 445
    },
    {
      id: 16,
      selected: false,
      reportNumber: '1585123121609',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-06-15',
      fullName: 'יוסי ברק',
      nid: '654987321',
      municipality: 'פתח תקווה',
      municipalityId: 13,
      status: 'סגור',
      statusId: 1,
      additionalReports: 378
    },
    {
      id: 17,
      selected: false,
      reportNumber: '1585123121610',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-05-08',
      fullName: 'נועה אברהם',
      nid: '147258369',
      municipality: 'רחובות',
      municipalityId: 14,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 612
    },
    {
      id: 18,
      selected: false,
      reportNumber: '1585123121611',
      inputField: '',
      yesNoRadio: 'כן',
      violationDate: '2025-04-12',
      fullName: 'עמיר כהן',
      nid: '963852741',
      municipality: 'הרצליה',
      municipalityId: 15,
      status: 'סגור',
      statusId: 1,
      additionalReports: 298
    },
    {
      id: 19,
      selected: false,
      reportNumber: '1585123121612',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-03-25',
      fullName: 'דנה לוי',
      nid: '852963741',
      municipality: 'רמת גן',
      municipalityId: 16,
      status: 'פתוח',
      statusId: 3,
      additionalReports: 456
    },
    {
      id: 20,
      selected: false,
      reportNumber: '1585123121612',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-03-25',
      fullName: 'דנה לוי',
      nid: '852963741',
      municipality: 'רמת גן',
      municipalityId: 16,
      status: 'פתוח',
      statusId: 1,
      additionalReports: 456
    },
    {
      id: 21,
      selected: false,
      reportNumber: '1585123121612',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-03-25',
      fullName: 'דנה לוי',
      nid: '852963741',
      municipality: 'רמת גן',
      municipalityId: 16,
      status: 'פתוח',
      statusId: 1,
      additionalReports: 456
    },
    {
      id: 22,
      selected: false,
      reportNumber: '1585123121612',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-03-25',
      fullName: 'דנה לוי',
      nid: '852963741',
      municipality: 'רמת גן',
      municipalityId: 16,
      status: 'פתוח',
      statusId: 1,
      additionalReports: 456
    },
    {
      id: 23,
      selected: false,
      reportNumber: '1585123121612',
      inputField: '',
      yesNoRadio: 'לא',
      violationDate: '2025-03-25',
      fullName: 'דנה לוי',
      nid: '852963741',
      municipality: 'רמת גן',
      municipalityId: 16,
      status: 'פתוח',
      statusId: 1,
      additionalReports: 456
    }
  ];
  
  
  data: any[] = [...this.originalData];

  
  get total(): number {
    return this.data.length;
  }
  

  
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
