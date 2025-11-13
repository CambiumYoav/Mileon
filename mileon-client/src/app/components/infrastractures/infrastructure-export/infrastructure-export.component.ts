import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructureEnumTexts } from '../../../types/enum/infrastructure.enum';

@Component({
  selector: 'app-infrastructure-export',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './infrastructure-export.component.html',
  styleUrls: ['./infrastructure-export.component.scss'],
})
export class InfrastructureExportComponent {
  private dialogRef = inject(MatDialogRef<InfrastructureExportComponent>);

  Icons = ConstPath;
  dataSubject = signal<any>(null);
  title = InfrastructureEnumTexts.ExportFileTitle;
  description = '';
  isSignsExport = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { description: string; isSignsExport?: boolean }
  ) {
    this.description =
      data?.description || InfrastructureEnumTexts.ExportFileDescription;
    this.isSignsExport = !!data?.isSignsExport;
  }

  onSubmit() {
    // Return whatever you need. Here a simple flag:
    this.dialogRef.close({
      confirmed: true,
      isSignsExport: this.isSignsExport,
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }
}
