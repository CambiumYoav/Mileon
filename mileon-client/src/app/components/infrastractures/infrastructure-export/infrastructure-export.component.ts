import { Component, Inject, signal, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { InfrastructureEnumTexts } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructure-export',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent
  ],
  templateUrl: './infrastructure-export.component.html',
  styleUrls: ['./infrastructure-export.component.scss'],
})
export class InfrastructureExportComponent {
  private dialogRef = inject(MatDialogRef<InfrastructureExportComponent>);
  private dialog = inject(MatDialog);

  Icons = ConstPath;
  
  dataSubject = signal<any>(null);
  title = signal<string>(InfrastructureEnumTexts.ExportFileTitle);
  description = signal<string>('');
  isSignsExport = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { description: string; isSignsExport?: boolean }
  ) {
    this.description.set(data?.description || InfrastructureEnumTexts.ExportFileDescription); // Default value
    this.isSignsExport.set(data?.isSignsExport || false);
  }

  onSubmit() {
    this.dataSubject.set('');
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
