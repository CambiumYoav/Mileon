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
import { AdvancedForm, FieldTypeEnum, FieldLengthEnum } from './types/advanced-search/form-tab.model';
import { InputDateComponent } from "./components/shared/base/inputs/input-date/input-date.component";
import { InputPhoneComponent } from "./components/shared/base/inputs/input-phone/input-phone.component";
import { InputCheckboxComponent } from "./components/shared/base/inputs/input-checkbox/input-checkbox.component";
import { SelectComponent } from "./components/shared/base/select/select.component";
import { TextareaCommentsComponent } from "./components/shared/base/inputs/textarea-comments/textarea-comments.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [BaseComponents, SharedImports, InputDateComponent, InputPhoneComponent, InputCheckboxComponent, SelectComponent, TextareaCommentsComponent], 
})
export class AppComponent {

  InputSizeEnum = InputSizeEnum;
  FieldTypeEnum = FieldTypeEnum;
  FieldLengthEnum = FieldLengthEnum;

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
                length: FieldLengthEnum.Medium
              },
              {
                name: 'nid',
                displayName: 'מספר זהות',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Short
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
  
  form: FormGroup = new FormGroup({});
  pageSize: number = 100;
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
  
  // Generate suggestions from the data
  searchSuggestions: string[] = [];
  
  previewFile: PreviewFileType | undefined;
  searchText: string = '';
  newComment: any;
  

  
  get total(): number {
    return this.data.length;
  }
  
  selectedUserData: Subject<any> = new Subject<any>();
  loader: boolean = false;
  showPaginator: boolean = true;
  TicketStagesIcons: Icon[] = [];
  selectedFiles: any[] = [];
  
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
    { id: 5, value: 'הושלם', label: 'הושלם' }
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

  constructor(
    private toastr: ToastrService,
    private appService: AppService
  ) {}
  
  ngOnInit() {
    this.appService.currentModuleName = 'TicketsNewModule';
    
    // Initialize form with all necessary controls including advanced search fields
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
        nid: new FormControl('')
      }),
      location: new FormGroup({
        municipality: new FormControl('')
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
    
    if (locationFilters.municipality) {
      // Now municipality is an ID from the select component
      filteredData = filteredData.filter(item => 
        item.municipalityId === parseInt(locationFilters.municipality)
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
      // Now status is an ID from the select component
      filteredData = filteredData.filter(item => 
        item.statusId === parseInt(dateFilters.status)
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
