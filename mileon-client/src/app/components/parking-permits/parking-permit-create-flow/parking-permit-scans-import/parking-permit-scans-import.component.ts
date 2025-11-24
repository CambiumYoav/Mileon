import { Component, inject, Inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConstPath } from '../../../../constants/const_path';
import {
  FileUploadComponenetType,
  FileType,
} from '../../../../types/enum/fileType.enum';
import { IdValuePair } from '../../../../types/legalRequest/legal-request-file-type-response';
import { ParkingPermitFileType } from '../../../../types/parkingPermit/parkingPermitFileType';
import { UploadedFile } from '../../../../types/uploadedFile';
import { InfrastructureEnumTexts } from '../../../../types/enum/infrastructure.enum';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/base/button/button.component';
import { FileUploadNewComponent } from '../../../shared/base/upload-files/upload-files.component';
import { SelectComponent } from '../../../shared/base/select/select.component';

@Component({
  selector: 'app-parking-permit-scans-import',
  templateUrl: './parking-permit-scans-import.component.html',
  styleUrls: ['./parking-permit-scans-import.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent,
    FileUploadNewComponent,
    SelectComponent
  ],
})
export class ParkingPermitScansImportComponent {
  private dialogRef = inject(MatDialogRef<ParkingPermitScansImportComponent>);
  // Constants and Enums
  readonly Icons = ConstPath;
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly FileType = FileType;

  // Component State
  dataSubject = signal<any>(null);
  title = signal<string>(InfrastructureEnumTexts.ImportFileTitle);
  description = signal<string>('');
  selectedFiles = signal<File | null>(null);
  fileTypes = signal<IdValuePair[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  types = signal<ParkingPermitFileType[]>([]);
  previewFiles = signal<any[]>([]);
  selectedType = signal<string>('');
  selectedTypeId = signal<number | null>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { types: any } // Injected data
  ) {
    this.types.set(data.types);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.selectedTypeId()) {
      /* show UI error and return */ return;
    }
    if (!this.selectedFiles()) {
      /* show UI error and return */ return;
    }
    console.log(this.previewFiles);
    this.dialogRef.close({
      uploadedFiles: this.selectedFiles() as File,
      selectedTypeId: this.selectedTypeId(),
      previewFiles: this.previewFiles(),
    });
  }

  // Closes the dialog without submitting
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Handles file upload from child component
  getUploadedFile(file: File): void {
    console.log('File received from child component:', file);
    this.selectedFiles.set(file);
  }

  // onTypeChange(selected: any) {
  //   console.log('Selected type:', selected);
  //   this.selectedType = selected;
  // }

  onTypeChange(selected: number) {
    this.selectedTypeId.set(selected);
  }

  getPreviewFiles(e: any) {
    this.previewFiles.set(e);
  }
}
