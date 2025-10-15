import { Component, Inject, signal, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import {
  FileUploadComponenetType,
  FileType,
} from '../../../types/enum/fileType.enum';  
import { InfrastructureSpecialTableTypes } from '../../../types/infrastructure/infrastructure-table.model';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-infrastructure-special-import',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ButtonComponent
  ],
  templateUrl: './infrastructure-special-import.component.html',
  styleUrls: ['./infrastructure-special-import.component.scss'],
})
export class InfrastructureSpecialImportComponent {
  private dialogRef = inject(MatDialogRef<InfrastructureSpecialImportComponent>);

  readonly Icons = ConstPath;
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly FileType = FileType;
  readonly types = InfrastructureSpecialTableTypes;

  dataSubject = signal<any>(null);
  title = signal<string>('ייבוא קובץ');
  description = signal<string>('');
  selectedFiles = signal<File | null>(null);
  fileTypes = signal<IdValuePair[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  isSignsImport = signal<boolean>(false);
  isSpecialImport = signal<boolean>(false);
  selectedType = signal<string>('');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {} 
  ) {}

  onSubmit(): void {
    this.dialogRef.close({
      uploadedFiles: this.selectedFiles(),
      selectedType: this.selectedType(),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Handles file upload from child component
  getUploadedFile(event: any): void {
    const file = event.target?.files?.[0];
    console.log('File received from child component:', file);
    this.selectedFiles.set(file);
  }

  onTypeChange(selected: any) {
    this.selectedType.set(selected);
  }
}
