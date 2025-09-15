import { FieldTypeEnum } from './../../../types/advanced-search/form-tab.model';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal, computed, effect, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { AuthorityService } from '../../../services/authority.service ';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { Column } from '../../../types/table';
import { TerminalService } from '../terminal.service';
import { RouterService } from '../../../services/router.service';  
import { ROUTE_PATH } from '../../../constants/routerPath';
import { TerminalSearchService } from '../terminal-search/terminal-search.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { SharedImports } from '../../../shared/shared-modules';  
import { SelectComponent } from "../../shared/base/select/select.component";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

import {
  inspectorFilterFields,
  InspectorsForm,
} from '../../../types/terminal/terminal-form-fields';
import { SummaryCardComponent } from "../../shared/summary-card/summary-card.component";
import { TerminalTableComponent } from "../terminal-table/terminal-table.component";
import { ButtonComponent } from "../../shared/base/button/button.component";

@Component({
  selector: 'app-terminal-inspectors',
  standalone: true,
  templateUrl: './terminal-inspectors.component.html',
  styleUrls: ['./terminal-inspectors.component.scss'],
  imports: [SummaryCardComponent, ...SharedImports, SelectComponent, MatSelectModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatOptionModule, TerminalTableComponent, ButtonComponent],
})


export class TerminalInspectorsComponent implements OnInit, OnDestroy {
  // Signals for reactive data
  title = signal(TitlesEnum.InspectorsDaily);
  FieldTypeEnum = FieldTypeEnum;
  seconderyTitle = signal(TitlesEnum.InspectorsTable);
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal(0);
  count = signal(0);
  loader = signal(false);
  currentAuthority = signal<string | null>(null);
  dashboardAlerts = signal(0);
  dashboardReports = signal(0);
  dashboardSum = signal(0);
  dashboardSuspended = signal(0);
  fields = signal<any>(null);

  // Form groups
  terminalForm: FormGroup;
  inspectorForm: FormGroup;

  // Inject services
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private terminalService = inject(TerminalService);
  private routerService = inject(RouterService);
  private terminalSearchFormService = inject(TerminalSearchService);
  private baseFormService = inject(BaseFormService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.terminalForm = this.terminalSearchFormService.form;
    this.inspectorForm = this.baseFormService.createFormGroup(InspectorsForm);
    this.inspectorForm.setControl('ticketTypes', new FormControl([0]));
    // Initialize inspectorsIds as an array for multi-select
    this.inspectorForm.setControl('inspectorsIds', new FormControl([]));
  }

  ngOnInit(): void {
    this.fields.set(inspectorFilterFields);

    // Subscribe to authority changes using takeUntilDestroyed
    this.authorityService.authorityId$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((authorityID) => {
        this.currentAuthority.set(authorityID);

        // Patch the form values
        this.inspectorForm.patchValue({
          authorityId: authorityID,
          ticketTypes: [0],
          inspectorsIds: [],
        });

        this.getInspectorsDashboardData();
        this.loadData(this.getCombinedFilter());

        // Subscribe to form changes using takeUntilDestroyed
        this.inspectorForm.get('inspectorsIds')?.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.onInspectorOrTypeChange();
          });

        this.inspectorForm.get('ticketTypes')?.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.onInspectorOrTypeChange();
          });

        this.inspectorForm.patchValue({ inspectorsIds: [], ticketTypes: [0] });
        this.clearForm();
      });
  }
  ngOnDestroy(): void {
    this.inspectorForm.patchValue({ inspectorsIds: [] });

    this.clearForm();
  }
  async loadData(filter: any) {
    this.loader.set(true);

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      const ids = this.inspectorForm.get('inspectorsIds')?.value;
      filter = {
        ...filter,
        inspectorsIds: Array.isArray(ids) ? ids : ids ? [ids] : [],
        authorityId: this.currentAuthority(),
        pageSize: 100,
      };
      const res = await this.terminalService.getAllInspectors(filter);
      if (res) {
        this.data.set(res.data);
        this.total.set(res.totalRecords);
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.error(e);
    }

    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      //  Ensure the loader stays visible for at least `MIN_LOADER_TIME`
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
    this.loader.set(false);
  }
  onInspectorOrTypeChange() {
    const ids = this.inspectorForm.get('inspectorsIds')?.value;
    const cleanIds = Array.isArray(ids) ? ids : ids ? [ids] : [];

    const types = this.inspectorForm.get('ticketTypes')?.value;
    const cleanTypes = Array.isArray(types) ? types : types ? [types] : [];

    // console.log('Form values changed:', {
    //   inspectorsIds: ids,
    //   cleanIds,
    //   ticketTypes: types,
    //   cleanTypes
    // });

    this.loadData(this.getCombinedFilter());

    const hasIds = cleanIds.length > 0;
    const hasRealTypes =
      cleanTypes.length > 1 || (cleanTypes.length === 1 && cleanTypes[0] !== 0);

    if (hasIds || hasRealTypes) {
      this.getInspectorsDashboardByIds();
    } else {
      this.getInspectorsDashboardData();
    }
  }

  goToInspectorDetails(e: any) {
    this.routerService.navigateToUrl(
      [
        ROUTE_PATH.Terminal.Home,
        ROUTE_PATH.Terminal.Inspectors,
        e.inspectorID,
        e.inspectorName,
      ],
      true
    );
  }

  async getInspectorsDashboardData() {
    try {
      const res = await this.terminalService.getInspectorsDashboard(
        this.currentAuthority()!
      );
      if (res) {
        this.dashboardReports.set(res.reports);
        this.dashboardAlerts.set(res.alerts);
        this.dashboardSuspended.set(res.suspended);
        this.dashboardSum.set(res.sum);
      }
    } catch (e) {}
  }
  
  async getInspectorsDashboardByIds() {
    try {
      const body = this.getFormValues();
      const res = await this.terminalService.getInspectorsDashboardByIds(body);

      if (res) {
        this.dashboardReports.set(res.reports);
        this.dashboardAlerts.set(res.alerts);
        this.dashboardSuspended.set(res.suspended);
        this.dashboardSum.set(res.sum);
      }
    } catch (e) {
      console.error('Error fetching dashboard by IDs:', e);
    }
  }

  getFormValues(): any {
    const ids = this.inspectorForm.get('inspectorsIds')?.value;
    const types = this.inspectorForm.get('ticketTypes')?.value;

    const body: any = {
      inspectorIds: Array.isArray(ids) ? ids : ids ? [ids] : [],
    };

    const cleanTypes = Array.isArray(types) ? types : types ? [types] : [];

    if (!(cleanTypes.length === 1 && cleanTypes[0] === 0)) {
      body.ticketTypes = cleanTypes;
    }
    return body;
  }
  // clearForm(): void {
  //   // Reset the inspector form
  //   if (this.inspectorForm) {
  //     this.inspectorForm.reset();

  //     // If you need to maintain the authority ID after reset
  //     this.inspectorForm.patchValue({
  //       authorityID: this.currentAuthority,
  //     });
  //   }
  // }

  // clearForm(): void {
  //   if (!this.inspectorForm) return;

  //   // Reset form
  //   this.inspectorForm.reset();

  //   // Force Angular to re-render
  //   this.cdr.detectChanges();

  //   // Apply authorityId with emitEvent false
  //   this.inspectorForm.patchValue(
  //     { authorityId: this.currentAuthority },
  //     { emitEvent: false } // prevents triggering valueChanges again
  //   );

  // }
  clearForm(): void {
    if (!this.inspectorForm) return;

    Object.keys(this.inspectorForm.controls).forEach((key) => {
      if (key !== 'authorityId') {
        const control = this.inspectorForm.get(key);
        if (control) {
          if (key === 'ticketTypes') {
            // Set default value for ticketTypes instead of empty array
            control.setValue([0], { emitEvent: false });
          } else if (key === 'inspectorsIds') {
            // Set empty array for multi-select inspectors
            control.setValue([], { emitEvent: false });
          } else {
            const isMulti = Array.isArray(control.value);
            control.setValue(isMulti ? [] : null, { emitEvent: false });
          }
        }
      }
    });

    this.inspectorForm.patchValue(
      { authorityId: this.currentAuthority() },
      { emitEvent: false }
    );

    this.loadData(this.getCombinedFilter());
    const ids = this.inspectorForm.get('inspectorsIds')?.value;
    const cleanIds = Array.isArray(ids) ? ids : ids ? [ids] : [];
    if (cleanIds.length === 0) {
      this.getInspectorsDashboardData();
    } else {
      this.getInspectorsDashboardByIds();
    }
    this.cdr.detectChanges();
  }

  private getCombinedFilter(): any {
    const ids = this.inspectorForm.get('inspectorsIds')?.value;
    const types = this.inspectorForm.get('ticketTypes')?.value;

    // Create a clean filter object for the GetInspectors API
    const filter: any = {
      inspectorsIds: Array.isArray(ids) ? ids : ids ? [ids] : [],
      authorityId: this.currentAuthority(),
      pageSize: 100,
      currentPage: 1,
    };

    const cleanedTypes = Array.isArray(types) ? types : types ? [types] : [];

    if (
      cleanedTypes.length > 0 &&
      !(cleanedTypes.length === 1 && cleanedTypes[0] === 0)
    ) {
      filter.ticketTypes = cleanedTypes;
    }

    return filter;
  }

  // Track function for better performance in @for loops
  trackByFieldName(index: number, field: any): string {
    return field.name;
  }
}
