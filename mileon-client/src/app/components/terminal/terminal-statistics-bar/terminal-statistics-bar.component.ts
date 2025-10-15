import { Component, OnInit, signal, computed, effect, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
Chart.register(...registerables, ChartDataLabels);
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model'; 
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import {
  BarChartFields,
  chartsValidation,
  TicketsBarChartForm,
} from '../../../types/terminal/terminal-form-fields';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { DateModeEnum, DateModeEnumMap } from '../../../types/enum/dateTypeEnum';
import { Utils } from '../../../utils/utils';
import { ChartTypeEnum } from '../../../types/enum/chartTypeEnum';
import { TerminalService } from '../terminal.service';
import { AuthorityService } from '../../../services/authority.service ';
import { debounceTime, filter } from 'rxjs';
import { StaticsBarResponse } from '../../../types/terminal/terminalStaticsResponse';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material-module';
import { SelectComponent } from "../../shared/base/select/select.component";
import { InputDateComponent } from "../../shared/base/inputs/input-date/input-date.component";
@Component({
  selector: 'app-terminal-statistics-bar',
  templateUrl: './terminal-statistics-bar.component.html',
  styleUrls: ['./terminal-statistics-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SelectComponent,
    InputDateComponent
  ],
})
export class TerminalStatisticsBarComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private readonly baseFormService = inject(BaseFormService);
  private readonly terminalService = inject(TerminalService);
  private readonly authorityService = inject(AuthorityService);

  readonly FieldTypeEnum = FieldTypeEnum;
  readonly secondaryTitle = TitlesEnum.StatisticsBarTitle;
  readonly DateModeEnum = DateModeEnum;
  readonly Utils = Utils;
  readonly chartFields = BarChartFields;

  chartForm: FormGroup;

  currentAuthority = toSignal(this.authorityService.authorityId$, { initialValue: null });
  response = signal<StaticsBarResponse[]>([]);
  selectedDateMode = signal<DateModeEnum>(DateModeEnum.Empty);
  isLoading = signal(false);
  modeChanges: any;
  private isInitializing = signal(true);
  formValueChanges!: any;

  private chart: Chart | null = null;

  hasRealData = computed(() => {
    const responseData = this.response();
    return responseData && responseData.length > 0 && 
           responseData.some((item: StaticsBarResponse) => item.ticketsCount > 0);
  });

  private chartData = computed<ChartData<'bar'>>(() => {
    const data = this.response();
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Filter out entries with zero or null/undefined values
    const filteredData = data.filter(item => 
      item && 
      item.ticketsCount > 0 && 
      item.violationName && 
      item.violationName.trim() !== ''
    );

    if (filteredData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = filteredData.map(item => item.violationName);
    const ticketCounts = filteredData.map(item => item.ticketsCount);
    const ticketSums = filteredData.map(item => item.ticketsSum || 0);

    return {
      labels,
      datasets: [
        {
          label: 'סכום (₪)',
          data: ticketSums,
          backgroundColor: '#387EC4',
          borderColor: '#387EC4',
          borderWidth: 0,
          ticketCounts: ticketCounts, 
        },
      ],
    };
  });

  private chartOptions = computed<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, 
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            const dataset = context.dataset;
            const dataIndex = context.dataIndex;
            const amount = context.parsed.x;
            const ticketCount = dataset.ticketCounts ? dataset.ticketCounts[dataIndex] : 0;
            
            return [
              `סה״כ דוחות: ${ticketCount}`,
              `סכום: ₪${amount.toLocaleString()}`
            ];
          },
          labelColor: (context: any) => {
            const dataIndex = context.dataIndex;
            
            if (context.labelIndex === 0) {
              return {
                borderColor: '#19A58C', 
                backgroundColor: '#19A58C',
              };
            } else {
              return {
                borderColor: '#387EC4', 
                backgroundColor: '#387EC4',
              };
            }
          }
        },
        backgroundColor: 'rgba(45, 55, 72, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#4A5568',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleAlign: 'center',
        bodyAlign: 'right',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'Open Sans',
        },
        bodyFont: {
          size: 13,
          family: 'Open Sans',
        },
        displayColors: true,
        caretPadding: 10,
      },
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'center',
          formatter: (value: number) => {
            return value > 0 ? `₪${value.toLocaleString()}` : '';
          },
          color: '#ffffff',
          font: {
            family: 'Open Sans',
            weight: 'bold',
            size: 14,
          },
          offset: 8, // Add some padding from the end of the bar
        },
    },
    scales: {
      x: {
        beginAtZero: true,
        display: false, 
      },
      y: {
        display: true,
        ticks: {
          color: '#4B494E',
          font: {
            size: 12,
            family: 'Open Sans',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  }));

  constructor() {
    this.chartForm = this.baseFormService.createFormGroup(TicketsBarChartForm);
    this.baseFormService.setValidations(this.chartForm, chartsValidation);
    
    // Convert form value changes to signal with debouncing
    this.formValueChanges = toSignal(
      this.chartForm.valueChanges.pipe(
        debounceTime(300),
        filter(() => this.chartForm.valid && !this.isInitializing())
      ),
      { initialValue: null }
    );
    
    const modeControlForSignal = this.chartForm.get('mode');
    if (modeControlForSignal) {
      this.modeChanges = toSignal(modeControlForSignal.valueChanges, { initialValue: null });
    }

    // Effect to handle authority changes
    effect(() => {
      const authorityId = this.currentAuthority();
      if (authorityId && this.isInitializing()) {
        // Use emitEvent: false to prevent triggering valueChanges
        this.chartForm.patchValue({
          authorityId: authorityId,
          ticketTypeId: 1,
          mode: this.getDefaultModeOption(), // Use helper method for consistency
          day: new Date(),
        }, { emitEvent: false });
        this.selectedDateMode.set(DateModeEnum.Daily);
        this.loadInspectors(authorityId);
        this.isInitializing.set(false);
      }
    });

    // Effect to handle mode changes
    effect(() => {
      const modeValue = this.modeChanges();
      if (modeValue !== undefined && modeValue !== null && !this.isInitializing()) {
        // Extract the value from the object if it's an object
        const actualModeValue = typeof modeValue === 'object' ? modeValue.value : modeValue;
        this.selectedDateMode.set(actualModeValue);
        Utils.updateValidatorsByMode(this.chartForm, actualModeValue);
      }
    });

    // Effect to handle form value changes
    effect(() => {
      const formValues = this.formValueChanges();
      if (formValues !== null && !this.isInitializing()) {
        this.getChartData();
      }
    });

    // Initialize mode if it exists
    const modeControlForInit = this.chartForm.get('mode');
    if (modeControlForInit?.value) {
      // Extract the value from the object if it's an object
      const initialModeValue = typeof modeControlForInit.value === 'object' ? modeControlForInit.value.value : modeControlForInit.value;
      this.selectedDateMode.set(initialModeValue);
      Utils.updateValidatorsByMode(this.chartForm, initialModeValue);
    }

    // Effect to update chart when data changes
    effect(() => {
      const data = this.chartData();
      const options = this.chartOptions();
      const hasData = this.hasRealData();
      
      // Only create/update chart if we have real data and not initializing
      if (hasData && data.datasets.length > 0 && !this.isInitializing()) {
        // Use setTimeout to ensure DOM is updated after template change
        setTimeout(() => {
          // Create chart if it doesn't exist and we have the canvas
          if (!this.chart && this.chartCanvas?.nativeElement) {
            this.createChart();
          }
          // Update existing chart only if data has actually changed
          else if (this.chart && this.chart.data !== data) {
            this.updateChart(data, options);
          }
        }, 0);
      } else if (!hasData && this.chart) {
        // Destroy chart if no real data, but only if it exists
        this.chart.destroy();
        this.chart = null;
      }
    });
  }

  ngOnInit(): void {
    // Initial chart data load will be handled by effects
  }


  ngAfterViewInit(): void {
    // Initialize chart after view is ready with a slight delay to ensure DOM is ready
    setTimeout(() => {
      if (this.hasRealData() && this.chartCanvas?.nativeElement) {
        this.createChart();
      }
    }, 100);
  }

  private async loadInspectors(authorityId: string): Promise<void> {
    try {
      const result = await this.terminalService.getInspectors({
        currentPage: 1,
        authorityID: authorityId,
      });
      
      const inspectorList = result.list;
      if (inspectorList?.length > 0) {
        const firstInspectorId = inspectorList[0].id;
        
        // Use emitEvent: false to prevent triggering valueChanges during initialization
        this.chartForm.patchValue({
          inspectorId: firstInspectorId,
        }, { emitEvent: false });
        
        // Now that all form values are set, trigger data loading once
        setTimeout(() => {
          this.getChartData();
        }, 100);
      }
    } catch (error) {
      // Handle error silently
    }
  }

  private createChart(): void {
    if (!this.chartCanvas?.nativeElement) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const data = this.chartData();
    const options = this.chartOptions();

    try {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data,
        options,
        plugins: [ChartDataLabels]
      });
    } catch (error) {
      // Handle error silently
    }
  }

  private updateChart(data: ChartData<'bar'>, options: ChartOptions<'bar'>): void {
    if (!this.chart) {
      return;
    }
    
    this.chart.data = data;
    this.chart.options = options;
    this.chart.update('active');
  }

  private async getChartData(): Promise<void> {
    if (!this.chartForm.valid || this.isLoading() || this.isInitializing()) {
      return; // Prevent concurrent calls and calls during initialization
    }

    try {
      this.isLoading.set(true);
      let formValues = this.chartForm.value;

      // Extract IDs from objects if they are objects
      if (formValues.inspectorId && typeof formValues.inspectorId === 'object') {
        formValues.inspectorId = formValues.inspectorId.id;
      }
      if (formValues.ticketTypeId && typeof formValues.ticketTypeId === 'object') {
        formValues.ticketTypeId = formValues.ticketTypeId.id;
      }

      formValues = {
        ...formValues,
        mode: DateModeEnumMap[this.selectedDateMode()],
      };

      const responseData = await this.terminalService.getReportViolationStatics(formValues);
      
      if (responseData && Array.isArray(responseData)) {
        this.response.set(responseData);
        
        // The chart will be automatically created/updated by the effect
        // No need for manual chart creation here
      } else {
        this.response.set([]);
      }
    } catch (error) {
      this.response.set([]);
      console.error('Error loading chart data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Helper method to convert readonly array to mutable array for template
  getFieldOptions(field: any): any[] {
    return field.options ? Array.from(field.options) : [];
  }

  // Helper method to get years list in the format expected by app-select
  getYearOptions(): any[] {
    const yearsList = Utils.getYearsList();
    return yearsList.map((year) => ({
      value: year,
      label: year.toString(),
    }));
  }

  // Helper method to get the default mode option for form initialization
  getDefaultModeOption(): any {
    return { id: 0, value: 'יומי' };
  }
}