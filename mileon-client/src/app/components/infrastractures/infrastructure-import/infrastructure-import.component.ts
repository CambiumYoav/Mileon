import { Component, Inject, signal, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import {
  FileType,
  FileUploadComponenetType,
} from '../../../types/enum/fileType.enum';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { FileUploadNewComponent } from "../../shared/base/upload-files/upload-files.component";
import { InfrastructureEnumTexts } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructure-import',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent,
    FileUploadNewComponent
  ],
  templateUrl: './infrastructure-import.component.html',
  styleUrls: ['./infrastructure-import.component.scss'],
})
export class InfrastructureImportComponent {
  private dialogRef = inject(MatDialogRef<InfrastructureImportComponent>);

  readonly Icons = ConstPath;
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly FileType = FileType;

  dataSubject = signal<any>(null);
  title = signal<string>(InfrastructureEnumTexts.ImportFileTitle);
  description = signal<string>('');
  selectedFiles = signal<File | null>(null);
  fileTypes = signal<IdValuePair[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  isSignsImport = signal<boolean>(false);
  isSpecialImport = signal<boolean>(false);
  
  allowedFileTypes: FileType[] = [FileType.XLSX, FileType.XLS, FileType.CSV];
  maxFileSizeMB = 10;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string;
      isSignsImport?: boolean;
      isSpecialImport?: boolean;
    }
  ) {
    this.description.set(
      data?.description ||
      InfrastructureEnumTexts.ImportFileDescription
    );  
    this.isSignsImport.set(data?.isSignsImport || false);
    this.isSpecialImport.set(data?.isSpecialImport || false);
  }

  onSubmit(): void {
    this.dialogRef.close({ uploadedFiles: this.selectedFiles() });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(file: File): void {
    this.selectedFiles.set(file);
    // Add logic to process or validate the file if needed
  }
}
