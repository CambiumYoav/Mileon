import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { ButtonComponent } from '../base/button/button.component';

@Component({
  selector: 'app-results-after-import',
  templateUrl: './results-after-import.component.html',
  styleUrls: ['./results-after-import.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent],
})
export class ResultsAfterImportComponent {
  readonly Icons = ConstPath;
  FieldTypeEnum = FieldTypeEnum;
  
  // Inject dependencies using inject() function
  private dialogRef = inject(MatDialogRef<ResultsAfterImportComponent>);
  private data = inject<{ totalRecords: string; successfulRecords: string; errorRecords: string; title: string }>(MAT_DIALOG_DATA);
  
  // Convert properties to signals
  title = signal(this.data.title);
  totalRecords = signal(this.data.totalRecords);
  successfulRecords = signal(this.data.successfulRecords);
  errorRecords = signal(this.data.errorRecords);
  isDownloadReport = signal(false);

  /** Closes the dialog */
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close();
  }

  onLinkClick(): void {
    this.isDownloadReport.set(true);
  }
}
