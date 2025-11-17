// import { Component, computed, effect, signal } from '@angular/core';
// import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
// import { TitlesEnum } from '../../../types/enum/titlesEnum';
// import {
//   chartsValidation,
//   InspectorsTableChartFields,
//   TicketsTableChartForm,
// } from '../../../types/terminal/terminal-form-fields';
// import { BaseFormService } from '../../shared/base-form/base-form.service';
// import { DateModeEnum, DateModeEnumMap } from '../../../types/enum/dateTypeEnum';
// import { Utils } from '../../../utils/utils';
// import { AuthorityService } from '../../../services/authority.service ';
// import { TerminalService } from '../terminal.service';
// import { StaticsTableResponse } from '../../../types/terminal/terminalStaticsResponse';
// import { debounceTime, filter } from 'rxjs';
// import { toSignal } from '@angular/core/rxjs-interop';
// import {
//   TicketTypeEnumMap,
//   TicketTypeForMapEnum,
// } from '../../../types/enum/ticketEnums';
// import { TerminalTableComponent } from "../terminal-table/terminal-table.component";
// import { InputDateComponent } from "../../shared/base/inputs/input-date/input-date.component";
// import { SelectComponent } from "../../shared/base/select/select.component";

// @Component({
//   selector: 'app-terminal-statistics-table',
//   templateUrl: './terminal-statistics-table.component.html',
//   styleUrls: ['./terminal-statistics-table.component.scss'],
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     TerminalTableComponent,
//     InputDateComponent,
//     SelectComponent
//   ],
// })
// export class TerminalStatisticsTableComponent {
//   readonly FieldTypeEnum = FieldTypeEnum;
//   readonly secondaryTitle = TitlesEnum.StatisticsTableTitle;
//   readonly DateModeEnum = DateModeEnum;
//   readonly Utils = Utils;
//   readonly chartFields = InspectorsTableChartFields;

//   // Years options for app-select
//   readonly yearsOptions = computed(() =>
//     Utils.getYearsList().map(year => ({ value: year, id: year }))
//   );

//   // Helper method to convert readonly options to mutable array
//   getMutableOptions = (options: readonly any[] | undefined): any[] => {
//     return options ? [...options] : [];
//   };

//   // Helper method to get the default mode option for form initialization
//   getDefaultModeOption(): any {
//     return { id: 0, value: 'יומי' };
//   }

//   selectedDateMode = signal<DateModeEnum>(DateModeEnum.Empty);
//   selectTicketType = signal<TicketTypeForMapEnum>(TicketTypeForMapEnum.ADMIN);
//   data = signal<any[]>([]);
//   total = signal<number>(0);
//   count = signal<number>(0);
//   loader = signal<boolean>(false);
//   chartForm = signal<FormGroup | null>(null);
//   currentAuthority = signal<string | null>(null);
//   response = signal<StaticsTableResponse[] | any[]>([]);

//   // Authority ID signal - will be initialized in constructor
//   private authorityId = signal<string | null>(null);
//   constructor(
//     private baseFormService: BaseFormService,
//     private terminalService: TerminalService,
//     private authorityService: AuthorityService
//   ) {
//     // Initialize form
//     const form = this.baseFormService.createFormGroup(TicketsTableChartForm);
//     this.baseFormService.setValidations(form, chartsValidation);
//     this.chartForm.set(form);

//     // Convert authority service observable to signal
//     const authorityIdSignal = toSignal(this.authorityService.authorityId$);

//     // Set up authority tracking
//     effect(() => {
//       const authorityId = authorityIdSignal();
//       if (authorityId) {
//         this.authorityId.set(authorityId);
//       }
//     });

//     // Set up reactive effects
//     this.setupReactiveEffects();
//   }
//   private setupReactiveEffects(): void {
//     // Effect for authority changes
//     effect(() => {
//       const authorityID = this.authorityId();
//       if (authorityID) {
//         this.currentAuthority.set(authorityID);
//         const form = this.chartForm();
//         if (form) {
//           form.patchValue({
//             authorityId: authorityID,
//             ticketTypeId: TicketTypeForMapEnum.ADMIN,
//             inspectorId: '70DD08B4-A93E-4167-E71C-08DAD05CE74F',
//             mode: this.getDefaultModeOption(), // Use helper method for consistency
//             day: new Date(),
//           });
//         }
//         this.selectedDateMode.set(DateModeEnum.Daily);
//         this.selectTicketType.set(TicketTypeForMapEnum.ADMIN);

//         this.loadInspectors(authorityID);

//         // Load data after form is properly initialized
//         setTimeout(() => {
//           if (form?.valid) {
//             this.loadData();
//           }
//         }, 100);
//       }
//     });

//     // Set up form control signals after form is created
//     const form = this.chartForm();
//     if (form) {
//       // Mode control tracking
//       const modeControl = form.get('mode');
//       if (modeControl) {
//         const modeSignal = toSignal(modeControl.valueChanges);
//         effect(() => {
//           const value = modeSignal();
//           if (value !== undefined) {
//             // Extract the value from the object if it's an object
//             const actualModeValue = typeof value === 'object' ? value.value : value;
//             this.selectedDateMode.set(actualModeValue);
//             Utils.updateValidatorsByMode(form, actualModeValue);
//           }
//         });
//       }

//       // Ticket type control tracking
//       const ticketTypeControl = form.get('ticketTypeId');
//       if (ticketTypeControl) {
//         const ticketTypeSignal = toSignal(ticketTypeControl.valueChanges);
//         effect(() => {
//           const value = ticketTypeSignal();
//           if (value !== undefined) {
//             // Extract the value from the object if it's an object
//             const actualTicketTypeValue = typeof value === 'object' ? value.id : value;
//             this.selectTicketType.set(actualTicketTypeValue);
//           }
//         });
//       }

//       // Form value changes for data loading
//       const formValueSignal = toSignal(
//         form.valueChanges.pipe(
//           debounceTime(300),
//           filter(() => form.valid)
//         )
//       );

//       effect(() => {
//         const formValue = formValueSignal();
//         if (formValue) {
//           this.loadData();
//         }
//       });
//     }
//   }
//   private async loadInspectors(authorityID: string): Promise<void> {
//     try {
//       const result = await this.terminalService.getInspectors({
//         currentPage: 1,
//         authorityID: authorityID,
//       });
//       const inspectorList = result.list;
//       if (inspectorList?.length > 0) {
//         const firstInspectorId = inspectorList[0].id;
//         const form = this.chartForm();
//         if (form) {
//           setTimeout(() => {
//             form.patchValue({
//               inspectorId: firstInspectorId,
//             });
//           }, 0);
//         }
//       }
//     } catch (error) {
//       // Handle error silently
//     }
//   }
//   async loadData(e?: any): Promise<void> {
//     try {
//       const form = this.chartForm();
//       if (!form || !form.valid) {
//         return;
//       }

//       this.loader.set(true);
//       let formValues = form.value;

//       // Ensure required fields are present
//       if (!formValues.authorityId) {
//         return;
//       }

//       // Extract IDs from objects if they are objects
//       if (formValues.inspectorId && typeof formValues.inspectorId === 'object') {
//         formValues.inspectorId = formValues.inspectorId.id;
//       }
//       if (formValues.ticketTypeId && typeof formValues.ticketTypeId === 'object') {
//         formValues.ticketTypeId = formValues.ticketTypeId.id;
//       }
//       if (formValues.areaId && typeof formValues.areaId === 'object') {
//         formValues.areaId = formValues.areaId.id;
//       }
//       if (formValues.streetId && typeof formValues.streetId === 'object') {
//         formValues.streetId = formValues.streetId.id;
//       }

//       formValues = {
//         ...formValues,
//         mode: DateModeEnumMap[this.selectedDateMode()],
//         ticketTypeId: TicketTypeEnumMap[this.selectTicketType()],
//       };

//       const response = await this.terminalService.getReportByInspectorStatics(
//         formValues
//       );

//       this.response.set(response || []);
//       if (response) {
//         const mappedData = response.map((item: any) => ({
//           ...item,
//           formattedTicketsSum: ` ${item.ticketsSum} ₪`,
//         }));
//         this.data.set(mappedData);
//       }
//     } catch (e) {
//       // Handle error silently
//     } finally {
//       this.loader.set(false);
//     }
//   }
// }
import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';
import { AuthorityService } from '../../../services/authority.service ';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import {
  DateModeEnum,
  DateModeEnumMap,
} from '../../../types/enum/dateTypeEnum';
import {
  TicketTypeForMapEnum,
  TicketTypeEnumMap,
} from '../../../types/enum/ticketEnums';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import {
  InspectorsTableChartFields,
  TicketsTableChartForm,
  chartsValidation,
} from '../../../types/terminal/terminal-form-fields';
import { StaticsTableResponse } from '../../../types/terminal/terminalStaticsResponse';
import { Utils } from '../../../utils/utils';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { TerminalService } from '../terminal.service';
import { CommonModule } from '@angular/common';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { TerminalTableComponent } from '../terminal-table/terminal-table.component';

@Component({
  selector: 'app-terminal-statistics-table',
  templateUrl: './terminal-statistics-table.component.html',
  styleUrls: ['./terminal-statistics-table.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TerminalTableComponent,
    InputDateComponent,
    SelectComponent,
  ],
})
export class TerminalStatisticsTableComponent implements OnInit {
  // Inject services using modern Angular 19 approach
  private baseFormService = inject(BaseFormService);
  private terminalService = inject(TerminalService);
  private authorityService = inject(AuthorityService);

  // Constants
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly secondaryTitle = TitlesEnum.StatisticsTableTitle;
  readonly DateModeEnum = DateModeEnum;
  readonly Utils = Utils;

  // Signals for reactive state
  selectedDateModeNumber = signal<number>(0);
  selectedDateMode = signal<DateModeEnum>(DateModeEnum.Empty);
  selectTicketType = signal<TicketTypeForMapEnum>(TicketTypeForMapEnum.ADMIN);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  loader = signal<boolean>(false);
  response = signal<StaticsTableResponse[] | any[]>([]);

  // Convert Observable to Signal
  currentAuthority = toSignal(this.authorityService.authorityId$, {
    initialValue: null,
  });
  readonly yearsOptions = computed(() =>
    Utils.getYearsList().map((year) => ({ value: year, id: year }))
  );
  // Form and fields
  chartForm: FormGroup;
  readonly chartFields = InspectorsTableChartFields;
  getMutableOptions = (options: readonly any[] | undefined): any[] => {
    return options ? [...options] : [];
  };
  // Computed values (if needed)
  hasData = computed(() => this.data().length > 0);

  constructor() {
    // Initialize form
    this.chartForm = this.baseFormService.createFormGroup(
      TicketsTableChartForm
    );
    this.baseFormService.setValidations(this.chartForm, chartsValidation);

    // React to authority changes using effect
    effect(() => {
      const authorityID = this.currentAuthority();
      if (authorityID !== null) {
        this.initializeFormWithAuthority(authorityID);
      }
    });

    // Setup mode changes with automatic cleanup
    const modeControl = this.chartForm.get('mode');
    if (modeControl) {
      modeControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
    
        this.selectedDateMode.set(value as DateModeEnum);
        this.selectedDateModeNumber.set(value)
        Utils.updateValidatorsByMode(this.chartForm, value);
      });
    }

    // Setup ticket type changes with automatic cleanup
    const ticketTypeControl = this.chartForm.get('ticketTypeId');
    if (ticketTypeControl) {
      ticketTypeControl.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe((value) => {
          this.selectTicketType.set(value);
        });
    }

    // Setup form value changes to load data
    this.chartForm.valueChanges
      .pipe(
        debounceTime(300),
        filter(() => this.chartForm.valid),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.loadData();
      });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private async initializeFormWithAuthority(
    authorityID: string | null
  ): Promise<void> {
    this.chartForm.patchValue({
      authorityId: authorityID,
      ticketTypeId: TicketTypeForMapEnum.ADMIN,
      inspectorId: '70DD08B4-A93E-4167-E71C-08DAD05CE74F',
      mode: DateModeEnum.Daily,
      day: new Date(),
    });

    this.selectedDateMode.set(DateModeEnum.Daily);
    this.selectedDateModeNumber.set(0)
    this.selectTicketType.set(TicketTypeForMapEnum.ADMIN);

    if (authorityID) {
      try {
        const result = await this.terminalService.getInspectors({
          currentPage: 1,
          authorityID: authorityID,
        });

        const inspectorList = result.list;
        if (inspectorList?.length > 0) {
          const firstInspectorId = inspectorList[0].id;

          setTimeout(() => {
            this.chartForm.patchValue({
              inspectorId: firstInspectorId,
            });
          }, 0);
        }
      } catch (error) {
        console.error('Error fetching inspectors:', error);
      }
    }
  }

  async loadData(e?: any): Promise<void> {
    try {
      this.loader.set(true);

      let formValues = this.chartForm.value;

      formValues = {
        ...formValues,
        mode: DateModeEnumMap[this.selectedDateMode()],
        ticketTypeId: TicketTypeEnumMap[this.selectTicketType()],
      };

      const apiResponse =
        await this.terminalService.getReportByInspectorStatics(formValues);

      this.response.set(apiResponse);

      if (apiResponse) {
        const formattedData = apiResponse.map((item: { ticketsSum: any }) => ({
          ...item,
          formattedTicketsSum: ` ${item.ticketsSum} ₪`,
        }));
        this.data.set(formattedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loader.set(false);
    }
  }
}
