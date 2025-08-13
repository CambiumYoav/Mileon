import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [BaseComponents, SharedImports],
})
export class AppComponent {
  title = 'mileon-client';

  
  form: FormGroup = new FormGroup({});
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
    }
  ];
  
  data: any[] = [
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
      status: 'פתוח',
      statusId: 1,
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
      status: 'פתוח',
      statusId: 1,
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
      status: 'פתוח',
      statusId: 1,
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
      status: 'סגור',
      statusId: 3,
      additionalReports: 526
    }
  ];
  
  total: number = 251;
  count: number = 10;
  selectedUserData: Subject<any> = new Subject<any>();
  loader: boolean = false;
  showPaginator: boolean = true;
  TicketStagesIcons: Icon[] = [];

  
  Icons = ConstPath;
  constructor(
    private toastr: ToastrService,
    private appService: AppService
  ) {}
  
  ngOnInit() {
    // Set the current module name for tag colors to work
    this.appService.currentModuleName = 'TicketsNewModule';
    
    // Initialize form with pagination
    this.form = new FormGroup({
      currentPage: new FormControl(1),
      pageSize: new FormControl(10)
    });
    
    // Set table data after initialization
    setTimeout(() => {
      this.loader = false;
    }, 100);
    
    // this.showSuccess();
    // this.showError();
  }
  showSuccess() {
    this.toastr.success('הפעולה הושלמה בהצלחה!');
  }
  showError() {
    this.toastr.error('משהו השתבש.');
  }
}
