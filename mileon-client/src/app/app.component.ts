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
      propertyName: 'status',
      displayName: 'סטטוס',
      type: ColumnTypeEnum.Text,
      canSort: true,
      sortByServer: false
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
      propertyName: 'reportType',
      displayName: 'סוג דוח',
      type: ColumnTypeEnum.Text,
      canSort: true,
      sortByServer: false
    },
    {
      propertyName: 'balance',
      displayName: 'יתרה',
      type: ColumnTypeEnum.Text,
      canSort: true,
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
      reportNumber: '1585123121594',
      reportType: 'חניה',
      violationDate: '2025-01-09',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'באר שבע',
      status: 'פתוח',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 2,
      reportNumber: '1585123121595',
      reportType: 'חניה',
      violationDate: '2026-02-25',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'אילת',
      status: 'סגור',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 3,
      reportNumber: '1585123121596',
      reportType: 'חניה',
      violationDate: '2026-03-30',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'תל אביב',
      status: 'פתוח',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 4,
      reportNumber: '1585123121597',
      reportType: 'חניה',
      violationDate: '2026-01-01',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'קריית שמונה',
      status: 'סגור',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 5,
      reportNumber: '1585123121598',
      reportType: 'חניה',
      violationDate: '2025-11-18',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'דימונה',
      status: 'פתוח',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 6,
      reportNumber: '1585123121599',
      reportType: 'חניה',
      violationDate: '2026-03-03',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'חיפה',
      status: 'סגור',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 7,
      reportNumber: '1585123121600',
      reportType: 'חניה',
      violationDate: '2025-08-15',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'נתניה',
      status: 'פתוח',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 8,
      reportNumber: '1585123121601',
      reportType: 'חניה',
      violationDate: '2025-09-22',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'ראשון לציון',
      status: 'סגור',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 9,
      reportNumber: '1585123121602',
      reportType: 'חניה',
      violationDate: '2025-10-07',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'מודיעין',
      status: 'פתוח',
      balance: 'התראה',
      additionalReports: 526
    },
    {
      id: 10,
      reportNumber: '1585123121603',
      reportType: 'חניה',
      violationDate: '2025-12-12',
      fullName: 'ישראל ישראלי',
      nid: '245987630',
      municipality: 'קיסריה',
      status: 'סגור',
      balance: 'התראה',
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
  constructor(private toastr: ToastrService) {}
  ngOnInit() {
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
