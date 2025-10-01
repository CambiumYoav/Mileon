import { TitlesEnum } from './../../../types/enum/titlesEnum';
import { Component, OnInit, signal, computed, effect, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
Chart.register(...registerables, ChartDataLabels);
import {
  chartsValidation,
  ticketsPieChartFields,
  TicketsPieChartForm,
} from '../../../types/terminal/terminal-form-fields'; 
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateModeEnum, DateModeEnumMap } from '../../../types/enum/dateTypeEnum';
import { Utils } from '../../../utils/utils';
import { ChartTypeEnum } from '../../../types/enum/chartTypeEnum';
import { AuthorityService } from '../../../services/authority.service ';
import { TerminalService } from '../terminal.service';
import { StaticsResponse } from '../../../types/terminal/terminalStaticsResponse';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';
import { SelectComponent } from "../../shared/base/select/select.component";
import { InputDateComponent } from "../../shared/base/inputs/input-date/input-date.component";
import { MaterialModule } from "../../../shared/material-module";

@Component({
  selector: 'app-terminal-statistics-pie',
  templateUrl: './terminal-statistics-pie.component.html',
  styleUrls: ['./terminal-statistics-pie.component.scss'],
  imports: [ReactiveFormsModule, SelectComponent, InputDateComponent, MaterialModule],
})
export class TerminalStatisticsPieComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  FieldTypeEnum = FieldTypeEnum;
  title = TitlesEnum.StatisticsTitle;
  secondaryTitle = TitlesEnum.StatisticsPieTitle;
  DateModeEnum = DateModeEnum;
  Utils = Utils;

  private baseFormService = inject(BaseFormService);
  private terminalService = inject(TerminalService);
  private authorityService = inject(AuthorityService);

  chartForm: FormGroup;
  chartFields = ticketsPieChartFields;

  response = signal<StaticsResponse[] | any[]>([]);
  selectedDateMode = signal<DateModeEnum>(DateModeEnum.Empty);
  formValueChanges: any;
  modeChanges: any;
  
  hasRealData = computed(() => {
    const responseData = this.response();
    return responseData.some((item: StaticsResponse) => item.percentage > 0);
  });
  
  private chart: Chart | null = null;
  
  currentAuthority = toSignal(this.authorityService.authorityId$, { initialValue: null });

  private chartData = computed<ChartData<'doughnut'>>(() => {
    const responseData = this.response();
    
    const labels: string[] = [];
    const data: number[] = [];
    
    if (responseData && responseData.length > 0) {
      responseData.forEach((item: StaticsResponse, index) => {
        // Changed condition to include 0 values and handle different data types
        if (item.percentage !== null && item.percentage !== undefined) {
          labels.push(item.displayName || `Item ${index + 1}`);
          data.push(Number(item.percentage));
        }
      });
    }

    // Check if all values are zero
    const totalValue = data.reduce((sum, value) => sum + value, 0);

    // If all values are zero, return empty data (chart won't be displayed)
    if (totalValue === 0 && labels.length > 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }

    
    // Ensure we have enough background colors for all data points
    const backgroundColors = ['#86D0F7', '#387EC4', '#D8E4F1', '#5BA3D9', '#2E6BA8', '#B8D4F2'];
    const colors = backgroundColors.slice(0, data.length);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
        },
      ],
    };
  });

  private chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      },
      datalabels: {
        display: true,
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels?.[context.dataIndex];
          if (value === 0) return null;
          const percentage = `${value.toFixed(1)}%`;
          return [label, percentage];
        },
        color: '#000000',
        borderRadius: [0, 6],
        padding: [{}, { top: 4, bottom: 4, left: 4, right: 4 }],
        font: [
          {
            family: 'Open Sans',
            weight: 'bold',
            size: 14,
          },
          {
            family: 'Open Sans',
            weight: 'bold',
            size: 14,
          },
        ],
        anchor: 'center',
        align: 'center',
      },
    },
  }));
  
  constructor() {
    this.chartForm = this.baseFormService.createFormGroup(TicketsPieChartForm);
    this.baseFormService.setValidations(this.chartForm, chartsValidation);
    
    // Initialize form value changes signal with debouncing after form creation
    this.formValueChanges = toSignal(
      this.chartForm.valueChanges.pipe(
        debounceTime(300),
        filter(() => this.chartForm.valid)
      ), 
      { initialValue: null }
    );
    
    // Initialize mode changes signal
    const modeControlForSignal = this.chartForm.get('mode');
    if (modeControlForSignal) {
      this.modeChanges = toSignal(modeControlForSignal.valueChanges, { initialValue: null });
    }
    
    // Effect to handle authority changes
    effect(() => {
      const authorityID = this.currentAuthority();
      if (authorityID) {
        this.chartForm.patchValue({
          authorityId: authorityID,
          ticketTypeId: 1, // Default to admin tickets
          mode: this.getDefaultModeOption(), // Use helper method for consistency
          day: new Date(),
        });
        this.selectedDateMode.set(DateModeEnum.Daily);
        
        // Load first inspector
        if (typeof authorityID === 'string') {
          this.loadFirstInspector(authorityID);
        }
      }
    });
    
    // Effect to handle form changes and trigger data loading
    effect(() => {
      const formChanges = this.formValueChanges();
      if (formChanges && this.chartForm.valid) {
        this.getChartData();
      }
    });
    
    // Effect to handle mode changes
    effect(() => {
      const modeValue = this.modeChanges();
      if (modeValue !== undefined && modeValue !== null) {
        // Extract the value from the object if it's an object
        const actualModeValue = typeof modeValue === 'object' ? modeValue.value : modeValue;
        // Convert string value to DateModeEnum
        const dateMode = this.getDateModeFromString(actualModeValue);
        this.selectedDateMode.set(dateMode);
        Utils.updateValidatorsByMode(this.chartForm, dateMode);
      }
    });
    
    // Initialize mode if it exists
    const modeControlForInit = this.chartForm.get('mode');
    if (modeControlForInit?.value) {
      // Extract the value from the object if it's an object
      const initialModeValue = typeof modeControlForInit.value === 'object' ? modeControlForInit.value.value : modeControlForInit.value;
      const initialDateMode = this.getDateModeFromString(initialModeValue);
      this.selectedDateMode.set(initialDateMode);
      Utils.updateValidatorsByMode(this.chartForm, initialDateMode);
    }
    
    // Effect to update chart when data changes
    effect(() => {
      const data = this.chartData();
      const options = this.chartOptions();
      
      
      // Only create/update chart if we have real data
      if (this.hasRealData()) {
        // Use setTimeout to ensure DOM is updated after template change
        setTimeout(() => {
          // Create chart if it doesn't exist and we have the canvas
          if (!this.chart && this.chartCanvas?.nativeElement && data && data.datasets[0]?.data.length > 0) {
            this.createChart();
          }
          // Update existing chart
          else if (this.chart && data && data.datasets[0]?.data.length > 0) {
            this.updateChart(data, options);
          }
        }, 0);
      } else {
        // Destroy chart if no real data
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
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
        type: 'doughnut',
        data,
        options,
        plugins: [ChartDataLabels]
      });
    } catch (error) {
      // Handle error silently
    }
  }

  private async loadFirstInspector(authorityID: string): Promise<void> {
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
      } else {
      }
    } catch (error) {
      // Handle error silently
    }
  }


  private updateChart(data: ChartData<'doughnut'>, options: ChartOptions<'doughnut'>): void {
    if (!this.chart) {
      return;
    }
    
    this.chart.data = data;
    this.chart.options = options;
    this.chart.update('active');
  }

  async getChartData() {
    try {
      // Check if form is valid before proceeding
      if (!this.chartForm.valid) {
        return;
      }

      let formValues = this.chartForm.value;

      // Extract IDs from objects if they are objects
      if (formValues.inspectorId && typeof formValues.inspectorId === 'object') {
        formValues.inspectorId = formValues.inspectorId.id;
      }
      if (formValues.mode && typeof formValues.mode === 'object') {
        formValues.mode = formValues.mode.id;
      }

      // Only override mode if it's not already a number
      if (typeof formValues.mode !== 'number') {
        formValues.mode = DateModeEnumMap[this.selectedDateMode()];
      }

      const responseData = await this.terminalService.getReportDistributionStatics(
        formValues
      );
      
      if (responseData && Array.isArray(responseData)) {
        this.response.set(responseData);
        // Create chart if it doesn't exist yet
        if (!this.chart) {
          this.createChart();
        }
      }
    } catch (e) {
      console.error('Error loading pie chart data:', e);
      this.response.set([]);
    }
  }

  // Helper method to convert readonly array to mutable array for template
  getFieldOptions(field: any): any[] {
    return field.options ? Array.from(field.options) : [];
  }

  // Helper method to get years list in the format expected by app-select
  getYearOptions(): any[] {
    const yearsList = Utils.getYearsList();
    return yearsList.map(year => ({
      value: year,
      label: year.toString()
    }));
  }

  // Helper method to convert string value to DateModeEnum
  private getDateModeFromString(value: string): DateModeEnum {
    switch (value) {
      case 'יומי':
        return DateModeEnum.Daily;
      case 'טווח תאריכים':
        return DateModeEnum.DateRange;
      case 'שנתי':
        return DateModeEnum.Year;
      default:
        return DateModeEnum.Empty;
    }
  }

  // Helper method to get the default mode option for form initialization
  getDefaultModeOption(): any {
    return { id: 0, value: 'יומי' };
  }
}