import { Component, OnInit, signal, computed, effect, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model'; 
import { TitlesEnum } from '../../../types/enum/titlesEnum'; 
import {
  chartsValidation,
  ticketsLineChartFields,
  TicketsLineChartForm,
} from '../../../types/terminal/terminal-form-fields'; 
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { ChartTypeEnum } from '../../../types/enum/chartTypeEnum';
import { StaticsLineResponse } from '../../../types/terminal/terminalStaticsResponse';
import { AuthorityService } from '../../../services/authority.service ';
import { TerminalService } from '../terminal.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';
import { SelectComponent } from "../../shared/base/select/select.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material-module';

@Component({
  selector: 'app-terminal-statistics-line',
  templateUrl: './terminal-statistics-line.component.html',
  styleUrls: ['./terminal-statistics-line.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SelectComponent
  ],
})
export class TerminalStatisticsLineComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private readonly baseFormService = inject(BaseFormService);
  private readonly terminalService = inject(TerminalService);
  private readonly authorityService = inject(AuthorityService);

  readonly FieldTypeEnum = FieldTypeEnum;
  readonly secondaryTitle = TitlesEnum.StatisticsLineTitle;
  readonly chartFields = ticketsLineChartFields;
  readonly lineChartType: ChartTypeEnum.Line = ChartTypeEnum.Line;
  readonly lineChartPlugins: any[] = [];
  readonly hebrewMonths = [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ];

  chartForm: FormGroup;

  currentAuthority = toSignal(this.authorityService.authorityId$, { initialValue: null });
  response = signal<StaticsLineResponse[]>([]);
  isLoading = signal(false);
  formValueChanges: any;
  
  private chart: Chart | null = null;

  hasRealData = computed(() => {
    const responseData = this.response();
    if (!responseData || responseData.length === 0) {
      return false;
    }
    
    // Check if there's any data (current year or last year) that's greater than 0
    // Handle potential null/undefined values more robustly
    return responseData.some((item: StaticsLineResponse) => {
      if (!item) return false;
      
      const currentCount = typeof item.currentYearCount === 'number' ? item.currentYearCount : 0;
      const lastCount = typeof item.lastYearCount === 'number' ? item.lastYearCount : 0;
      
      return currentCount > 0 || lastCount > 0;
    });
  });

  private chartData = computed<ChartData<'line'>>(() => {
    const data = this.response();
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = data.map(item => this.hebrewMonths[item.month - 1]);
    const currentYearData = data.map(item => item.currentYearCount);
    const lastYearData = data.map(item => item.lastYearCount);

    return {
      labels,
      datasets: [
        {
          label: 'השנה הנוכחית',
          data: currentYearData,
          borderColor: '#387EC4',
          backgroundColor: 'rgba(56, 126, 196, 0.2)',
          fill: false,
          tension: 0.4,
        },
        {
          label: 'שנה קודמת',
          data: lastYearData,
          borderColor: '#19A58C',
          backgroundColor: 'rgba(25, 165, 140, 0.2)',
          fill: false,
          tension: 0.4,
        },
      ],
    };
  });

  private chartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'כמות דוחות',
          color: '#4B494E',
          font: {
            size: 15,
            weight: 'normal',
            family: 'Open Sans',
          },
        },
        ticks: {
          stepSize: 10,
        },
        beginAtZero: true,
      },
      x: {
        title: {
          display: true,
          text: 'חודשים',
          color: '#4B494E',
          font: {
            size: 15,
            weight: 'normal',
            family: 'Open Sans',
          },
        },
      },
    },
  }));

  constructor() {
    this.chartForm = this.baseFormService.createFormGroup(TicketsLineChartForm);
    this.baseFormService.setValidations(this.chartForm, chartsValidation);
    
    // Initialize form value changes signal with debouncing after form creation
    this.formValueChanges = toSignal(
      this.chartForm.valueChanges.pipe(
        debounceTime(300),
        filter(() => this.chartForm.valid)
      ), 
      { initialValue: null }
    );

    // Effect to handle authority changes
    effect(() => {
      const authorityId = this.currentAuthority();
      if (authorityId) {
        this.chartForm.patchValue({
          authorityId: authorityId,
          ticketTypeId: 1,
        });
        this.loadInspectors(authorityId);
      }
    });

    // Effect to handle form changes and trigger data loading
    effect(() => {
      const formChanges = this.formValueChanges();
      if (formChanges) {
        this.getChartData();
      }
    });

    // Effect to update chart when data changes
    effect(() => {
      const data = this.chartData();
      const options = this.chartOptions();
      const hasData = this.hasRealData();
      
      // Only create/update chart if we have real data
      if (hasData && data.datasets.length > 0) {
        // Use setTimeout to ensure DOM is updated after template change
        setTimeout(() => {
          // Create chart if it doesn't exist and we have the canvas
          if (!this.chart && this.chartCanvas?.nativeElement) {
            this.createChart();
          }
          // Update existing chart
          else if (this.chart) {
            this.updateChart(data, options);
          }
        }, 0);
      } else {
        // Destroy chart if no real data, but only if it exists
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


  private async loadInspectors(authorityId: string): Promise<void> {
    try {
      const result = await this.terminalService.getInspectors({
        currentPage: 1,
        authorityID: authorityId,
      });
      
      const inspectorList = result.list;
      if (inspectorList?.length > 0) {
        const firstInspectorId = inspectorList[0].id;
        
        // Use setTimeout to ensure the form update happens in the next tick
        setTimeout(() => {
          this.chartForm.patchValue({
            inspectorId: firstInspectorId,
          });
        }, 0);
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
        type: 'line',
        data,
        options
      });
    } catch (error) {
      // Handle error silently
    }
  }

  private updateChart(data: ChartData<'line'>, options: ChartOptions<'line'>): void {
    if (!this.chart) {
      return;
    }
    
    this.chart.data = data;
    this.chart.options = options;
    this.chart.update('active');
  }

  private async getChartData(): Promise<void> {
    if (!this.chartForm.valid) {
      return;
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

      const responseData = await this.terminalService.getReportYearlyStatics(formValues);
      
      if (responseData && Array.isArray(responseData)) {
        this.response.set(responseData);
        
        // The chart will be automatically created/updated by the effect
        // No need for manual chart creation here
      } else {
        this.response.set([]);
      }
    } catch (error) {
      this.response.set([]);
      // TODO: Add toaster notification for error handling
    } finally {
      this.isLoading.set(false);
    }
  }

  // Helper method to convert readonly array to mutable array for template
  getFieldOptions(field: any): any[] {
    return field.options ? Array.from(field.options) : [];
  }
}
