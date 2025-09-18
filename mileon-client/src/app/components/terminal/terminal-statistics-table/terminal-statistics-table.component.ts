import { Component, computed, effect, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import {
  chartsValidation,
  InspectorsTableChartFields,
  TicketsTableChartForm,
} from '../../../types/terminal/terminal-form-fields';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { DateModeEnum, DateModeEnumMap } from '../../../types/enum/dateTypeEnum';
import { Utils } from '../../../utils/utils';
import { AuthorityService } from '../../../services/authority.service ';
import { TerminalService } from '../terminal.service';
import { StaticsTableResponse } from '../../../types/terminal/terminalStaticsResponse';
import { debounceTime, filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  TicketTypeEnumMap,
  TicketTypeForMapEnum,
} from '../../../types/enum/ticketEnums';
import { TerminalTableComponent } from "../terminal-table/terminal-table.component";
import { InputDateComponent } from "../../shared/base/inputs/input-date/input-date.component";
import { SelectComponent } from "../../shared/base/select/select.component";

@Component({
  selector: 'app-terminal-statistics-table',
  templateUrl: './terminal-statistics-table.component.html',
  styleUrls: ['./terminal-statistics-table.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TerminalTableComponent, 
    InputDateComponent, 
    SelectComponent
  ],
})
export class TerminalStatisticsTableComponent {
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly secondaryTitle = TitlesEnum.StatisticsTableTitle;
  readonly DateModeEnum = DateModeEnum;
  readonly Utils = Utils;
  readonly chartFields = InspectorsTableChartFields;
  
  // Years options for app-select
  readonly yearsOptions = computed(() => 
    Utils.getYearsList().map(year => ({ value: year, id: year }))
  );
  
  // Helper method to convert readonly options to mutable array
  getMutableOptions = (options: readonly any[] | undefined): any[] => {
    return options ? [...options] : [];
  };
  
  // Signals
  selectedDateMode = signal<DateModeEnum>(DateModeEnum.Empty);
  selectTicketType = signal<TicketTypeForMapEnum>(TicketTypeForMapEnum.ADMIN);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  loader = signal<boolean>(false);
  chartForm = signal<FormGroup | null>(null);
  currentAuthority = signal<string | null>(null);
  response = signal<StaticsTableResponse[] | any[]>([]);
  
  // Authority ID signal - will be initialized in constructor
  private authorityId = signal<string | null>(null);
  constructor(
    private baseFormService: BaseFormService,
    private terminalService: TerminalService,
    private authorityService: AuthorityService
  ) {
    // Initialize form
    const form = this.baseFormService.createFormGroup(TicketsTableChartForm);
    this.baseFormService.setValidations(form, chartsValidation);
    this.chartForm.set(form);
    
    // Convert authority service observable to signal
    const authorityIdSignal = toSignal(this.authorityService.authorityId$);
    
    // Set up authority tracking
    effect(() => {
      const authorityId = authorityIdSignal();
      if (authorityId) {
        this.authorityId.set(authorityId);
      }
    });
    
    // Set up reactive effects
    this.setupReactiveEffects();
  }
  private setupReactiveEffects(): void {
    // Effect for authority changes
    effect(() => {
      const authorityID = this.authorityId();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        const form = this.chartForm();
        if (form) {
          form.patchValue({
            authorityId: authorityID,
            ticketTypeId: TicketTypeForMapEnum.ADMIN,
            inspectorId: '70DD08B4-A93E-4167-E71C-08DAD05CE74F',
            mode: DateModeEnum.Daily,
            day: new Date(),
          });
        }
        this.selectedDateMode.set(DateModeEnum.Daily);
        this.selectTicketType.set(TicketTypeForMapEnum.ADMIN);
        
        this.loadInspectors(authorityID);
        
        // Load data after form is properly initialized
        setTimeout(() => {
          if (form?.valid) {
            this.loadData();
          }
        }, 100);
      }
    });
    
    // Set up form control signals after form is created
    const form = this.chartForm();
    if (form) {
      // Mode control tracking
      const modeControl = form.get('mode');
      if (modeControl) {
        const modeSignal = toSignal(modeControl.valueChanges);
        effect(() => {
          const value = modeSignal();
          if (value !== undefined) {
            this.selectedDateMode.set(value);
            Utils.updateValidatorsByMode(form, value);
          }
        });
      }
      
      // Ticket type control tracking
      const ticketTypeControl = form.get('ticketTypeId');
      if (ticketTypeControl) {
        const ticketTypeSignal = toSignal(ticketTypeControl.valueChanges);
        effect(() => {
          const value = ticketTypeSignal();
          if (value !== undefined) {
            this.selectTicketType.set(value);
          }
        });
      }
      
      // Form value changes for data loading
      const formValueSignal = toSignal(
        form.valueChanges.pipe(
          debounceTime(300),
          filter(() => form.valid)
        )
      );
      
      effect(() => {
        const formValue = formValueSignal();
        if (formValue) {
          this.loadData();
        }
      });
    }
  }
  private async loadInspectors(authorityID: string): Promise<void> {
    try {
      const result = await this.terminalService.getInspectors({
        currentPage: 1,
        authorityID: authorityID,
      });
      const inspectorList = result.list;
      if (inspectorList?.length > 0) {
        const firstInspectorId = inspectorList[0].id;
        const form = this.chartForm();
        if (form) {
          setTimeout(() => {
            form.patchValue({
              inspectorId: firstInspectorId,
            });
          }, 0);
        }
      }
    } catch (error) {
      console.error('Error fetching inspectors:', error);
    }
  }
  async loadData(e?: any): Promise<void> {
    try {
      const form = this.chartForm();
      if (!form || !form.valid) {
        console.log('Form is not valid, skipping data load');
        return;
      }
      
      this.loader.set(true);
      let formValues = form.value;

      // Ensure required fields are present
      if (!formValues.authorityId) {
        console.log('Authority ID is missing, skipping data load');
        return;
      }

      formValues = {
        ...formValues,
        mode: DateModeEnumMap[this.selectedDateMode()],
        ticketTypeId: TicketTypeEnumMap[this.selectTicketType()],
      };

      const response = await this.terminalService.getReportByInspectorStatics(
        formValues
      );
      
      this.response.set(response || []);
      if (response) {
        const mappedData = response.map((item: any) => ({
          ...item,
          formattedTicketsSum: ` ${item.ticketsSum} ₪`,
        }));
        this.data.set(mappedData);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      this.loader.set(false);
    }
  }
}
