import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ConstPath } from '../../../constants/const_path';
import { FileType } from '../../../types/enum/fileType.enum';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { FileUploadNewComponent } from '../../shared/base/upload-files/upload-files.component';

@Component({
  selector: 'app-parking-permits-import',
  templateUrl: './parking-permits-import.component.html',
  styleUrl: './parking-permits-import.component.scss',
  imports:[ButtonComponent,FileUploadNewComponent]
})
export class ParkingPermitsImportComponent {
  Icons = ConstPath;

  readonly FileType = FileType;
  dataSubject = new Subject<any>(); // Observable to emit data
  title: string = 'יבוא קובץ';
  description: string = '';
  selectedFiles: File | null = null;
  fileTypes: IdValuePair[] = [];
  filesToUpload: UploadedFile[] = []; // Tracks files for upload
  constructor(
    public dialogRef: MatDialogRef<ParkingPermitsImportComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { description: string }
  ) {
    this.description =
      data?.description ||
      'קוד,תיאור התו,מחיר התו,משך תוקף התו שניתן לתושב,תקף בימים,שעות התו,אזורים,פעיל / לא פעיל';
  }

  ngOnInit(): void {}

  onSubmit() {
    this.dialogRef.close({ uploadedFiles: this.selectedFiles });
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  getUploadedFile(file: File): void {
    // console.log('File received from child component:', file);
    this.selectedFiles = file;
    // Add logic to process or validate the file if needed
  }
}
