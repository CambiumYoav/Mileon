import { ChangeDetectorRef, Component, signal, computed, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ROUTE_PATH } from '../../../constants/routerPath';  
import { AuthorityService } from '../../../services/authority.service ';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { Column } from '../../../types/table';
import { RouterService } from '../../../services/router.service';
import { TerminalService } from '../terminal.service';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { TicketsService } from '../../tickets-new/tickets.service';
import { TerminalSearchService } from '../terminal-search/terminal-search.service';
import { ActivatedRoute } from '@angular/router';
import { ConstPath } from '../../../constants/const_path';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  inspectorDailyFilterFields,
  InspectorForm,
} from '../../../types/terminal/terminal-form-fields';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { CommonModule } from '@angular/common';
import { SharedImports } from '../../../shared/shared-modules';
import { TerminalTableComponent } from "../terminal-table/terminal-table.component";
import { SummaryCardComponent } from "../../shared/summary-card/summary-card.component";
import { ButtonComponent } from "../../shared/base/button/button.component";
import { SelectComponent } from "../../shared/base/select/select.component";

@Component({
  selector: 'app-terminal-inspector-daily',
  standalone: true,
  templateUrl: './terminal-inspector-daily.component.html',
  styleUrls: ['./terminal-inspector-daily.component.scss'],
  imports: [...SharedImports, ReactiveFormsModule, CommonModule, TerminalTableComponent, SummaryCardComponent, ButtonComponent, SelectComponent],
})
export class TerminalInspectorDailyComponent {
  FieldTypeEnum = FieldTypeEnum;
  Icons = ConstPath;
  
  title = signal(TitlesEnum.InspectorDaily);
  seconderyTitle = signal(TitlesEnum.InspectorsTable);
  inspectorName = signal<any>('');
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal(0);
  count = signal(0);
  loader = signal(false);
  currentAuthority = signal<string | null>(null);
  searchData = signal<TicketFilterOptions>(new TicketFilterOptions({currentPage: 1}));
  todayDate = signal<Date>(new Date());
  inspectorID = signal<any>('');
  dashboardAlerts = signal(0);
  dashboardReports = signal(0);
  dashboardSum = signal(0);
  dashboardSuspended = signal(0);
  fields = signal<any>(null);
  ticketTypes = signal<any[]>([]);

  terminalForm: FormGroup;
  inspectorForm: FormGroup;

  private authorityService = inject(AuthorityService);
  private terminalService = inject(TerminalService);
  private routerService = inject(RouterService);
  private ticketService = inject(TicketsService);
  public terminalSearchFormService = inject(TerminalSearchService);
  private route = inject(ActivatedRoute);
  private baseFormService = inject(BaseFormService);
  private cdr = inject(ChangeDetectorRef);

  // Convert authority service to signal
  private authorityIdSignal = toSignal(this.authorityService.authorityId$, { initialValue: null });

  constructor() {
    this.terminalForm = this.terminalSearchFormService.searchForm;
    this.inspectorForm = this.baseFormService.createFormGroup(InspectorForm);
    this.inspectorForm.setControl('ticketTypes', new FormControl([0]));

    // Use effect to react to authority changes
    effect(() => {
      const authorityID = this.authorityIdSignal();
      this.currentAuthority.set(authorityID);
      
      if (authorityID) {
        this.getInspectorsDashboardData();
        this.inspectorForm.patchValue({
          ticketTypes: [0],
        });
        this.loadData(this.terminalSearchFormService.searchForm.value);
      }
    });

    // Use effect to react to form changes
    effect(() => {
      const ticketTypes = this.inspectorForm.get('ticketTypes')?.value;
      
      if (ticketTypes !== undefined) {
        this.onInspectorOrTypeChange();
      }
    });
  }

  ngOnInit(): void {
    this.inspectorID.set(this.route.snapshot.paramMap.get('inspectorId'));
    this.inspectorName.set(this.route.snapshot.paramMap.get('inspectorName'));
    this.fields.set(inspectorDailyFilterFields);
  }

  async loadData(filter: TicketFilterOptions) {
    this.loader.set(true);
    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      filter.pageSize = 100;

      filter.interfaceFilter!.InspectorID = this.inspectorID();
      filter.interfaceFilter!.TicketGivingDate = this.todayDate();

      filter.violationDetailsFilter!.authorityID = [this.currentAuthority()!];
      filter.violationDetailsFilter!.ticketTypeID = this.ticketTypes();

      const res = await this.ticketService.getTickets(filter);
      if (res && res.list) {
        this.data.set(res.list.map((ticket) => {
          const date = new Date(ticket.violationDate);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          return {
            ...ticket,
            violationTime: `${hours}:${minutes}`,
          };
        }));

        this.total.set(res.total);
      }
    } catch (e) {
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

  goToInspectorDetails(e: any) {
    this.routerService.navigateToUrl(
      [
        ROUTE_PATH.TicketsNew.Home,
        ROUTE_PATH.TicketsNew.Ticket,
        e.ticketID,
        ROUTE_PATH.TicketsNew.Details,
      ],
      true,
      {
        state: {
          from: this.routerService.getCurrentUrl(),
        },
      }
    );
  }

  async getInspectorsDashboardData() {
    try {
      const res = await this.terminalService.getInspectorsDashboard(
        this.currentAuthority()!,
        this.inspectorID()
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

  back() {
    // this.routerService.back();
    this.routerService.navigateToUrl(
      [ROUTE_PATH.Terminal.Home, ROUTE_PATH.Terminal.Inspectors],
      true
    );
  }

  onInspectorOrTypeChange() {
    // const ids = this.inspectorForm.get('inspectorsIds')?.value;
    // const cleanIds = Array.isArray(ids) ? ids : ids ? [ids] : [];

    const types = this.inspectorForm.get('ticketTypes')?.value;
    const cleanTypes = Array.isArray(types) ? types : types ? [types] : [];

    this.getCombinedFilter();
    const hasRealTypes =
      cleanTypes.length > 1 || (cleanTypes.length === 1 && cleanTypes[0] !== 0);

    if (hasRealTypes) {
      this.getInspectorsDashboardByIds();
    } else {
      this.getInspectorsDashboardData();
    }
    this.loadData(this.terminalSearchFormService.searchForm.value);
  }
  private getCombinedFilter(): any {
    const types = this.inspectorForm.get('ticketTypes')?.value;

    const cleanedTypes = Array.isArray(types) ? types : types ? [types] : [];

    if (
      cleanedTypes.length > 0 &&
      !(cleanedTypes.length === 1 && cleanedTypes[0] === 0)
    ) {
      this.ticketTypes.set(cleanedTypes);
    }

    return cleanedTypes;
  }
  getFormValues(): any {
    const types = this.inspectorForm.get('ticketTypes')?.value;

    const body: any = {
      inspectorIds: [this.inspectorID()],
    };

    const cleanTypes = Array.isArray(types) ? types : types ? [types] : [];

    if (!(cleanTypes.length === 1 && cleanTypes[0] === 0)) {
      body.ticketTypes = cleanTypes.map(type => 
        typeof type === 'object' && type !== null ? type.id : type
      );
    }
    
    return body;
  }
  clearForm(): void {
    if (!this.inspectorForm) return;
    Object.keys(this.inspectorForm.controls).forEach((key) => {
      if (key !== 'authorityId') {
        const control = this.inspectorForm.get(key);
        if (control) {
          if (key === 'ticketTypes') {
            // Set default value for ticketTypes instead of empty array
            control.setValue([0], { emitEvent: false });
            this.ticketTypes.set([]);
          } else {
            const isMulti = Array.isArray(control.value);
            control.setValue(isMulti ? [] : null, { emitEvent: false });
          }
        }
      }
    });
    this.ticketTypes.set([]);

    this.inspectorForm.patchValue(
      { authorityId: this.currentAuthority() },
      { emitEvent: false }
    );

    setTimeout(() => {
      // this.getCombinedFilter();
      this.onInspectorOrTypeChange()
      // this.loadData(this.terminalSearchFormService.searchForm.value);
      // this.loadData(this.getCombinedFilter());
      this.cdr.detectChanges();
    }, 0);
  }

  get formattedAmount(): string {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(this.dashboardSum());
  }

    // Track function for better performance in @for loops
    trackByFieldName(index: number, field: any): string {
      return field.name;
    }
}
