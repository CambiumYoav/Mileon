import { Component, signal, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConstPath } from '../../../../constants/const_path'; 
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { InfrastructureTable } from '../../../../types/infrastructure/infrastructure-table.model';
import { Column } from '../../../../types/table';
import { Utils } from '../../../../utils/utils';
import { InfrastructureExportComponent } from '../../infrastructure-export/infrastructure-export.component';
import { InfrastructureService } from '../../infrastructure.service';
import { InfrastructureSearchFormService } from '../../infrastructures-search/infrastructure-search-form.service';
import { InfrastructureTablesTypes } from '../../../../types/enum/infrastructureTablesEnum';
import { SearchFormService } from '../../../shared/search-bar/search-form.service';
import { ToastrService } from 'ngx-toastr';
import { InfrastructuresUtils } from '../../../../utils/infrastructuresUtils';
import { ButtonComponent } from '../../../shared/base/button/button.component';
import { InfrastructuresTableComponent } from '../../infrastructures-table/infrastructures-table.component';

@Component({
  selector: 'app-infrastructures-tickets-statuses',
  templateUrl: './infrastructures-tickets-statuses.component.html',
  styleUrls: ['./infrastructures-tickets-statuses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent,
    InfrastructuresTableComponent
  ]
})
export class InfrastructuresTicketsStatusesComponent implements OnInit {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);

  title = signal<string>(TitlesEnum.InfrastructureTicketsStatusesTitle);
  Icons = ConstPath;
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  loader = signal<boolean>(false);
  exportDialogResult = signal<any>(null);
  infrastructureForm: FormGroup;

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.TicketsStatusesTable);
    this.loadData(this.infrastructureSearchFormService.form);
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        // height: '300px',
        autoFocus: false,
        data: {
          description: 'קוד,תיאור',
        },
      });
      const dialogInstance = dialogRef.componentInstance;
      
      const dialogEffectRef = effect(() => {
        const result = this.exportDialogResult();
        if (result) {
          this.exportData();
          this.dialog.closeAll();
          this.exportDialogResult.set(null); // Reset after handling
        }
      });
    }
  }

  async loadData(filter: any) {
    this.loader.set(true);

    const startTime = Date.now();
    try {
      const result = await this.infrastructureServer.getInfrastructureTable(
        filter.value,
        InfrastructureTablesTypes.TicketStatus
      );

      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);
    } catch (e) {
      InfrastructuresUtils.handleError(e, 'loadData');
    }
    
    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
    this.loader.set(false);
  }

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.TicketStatus,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }
}
