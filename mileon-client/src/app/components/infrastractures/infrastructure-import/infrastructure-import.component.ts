import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ConstPath } from '../../../constants/const_path';
import {
  FileType,
  FileUploadComponenetType,
} from '../../../types/enum/fileType.enum';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { SharedImports } from '../../../shared/shared-modules';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { FileUploadNewComponent } from "../../shared/base/upload-files/upload-files.component";

@Component({
  selector: 'app-infrastructure-import',
  templateUrl: './infrastructure-import.component.html',
  styleUrls: ['./infrastructure-import.component.scss'],
  imports: [...SharedImports, ButtonComponent, FileUploadNewComponent],
})
export class InfrastructureImportComponent implements OnInit {
  readonly Icons = ConstPath;
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly FileType = FileType;
  dataSubject = new Subject<any>();

  title: string = 'יבוא מבנה קובץ';
  description: string;
  selectedFiles: File | null = null;
  fileTypes: IdValuePair[] = [];
  filesToUpload: UploadedFile[] = [];
  isSignsImport: boolean = false;
  isSpecialImport: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InfrastructureImportComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string;
      isSignsImport?: boolean;
      isSpecialImport?: boolean;
    }
  ) {
    this.description =
      data?.description ||
      'קוד, ת.זהות, שם פרטי, שם משפחה, ישוב , רחוב, מספר בית, כניסה, דירה, מיקוד , טלפון, טלפון נייד, מייל';
    this.isSignsImport = data?.isSignsImport || false;
    this.isSpecialImport = data?.isSpecialImport || false;
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.dialogRef.close({ uploadedFiles: this.selectedFiles });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUploadedFile(file: File): void {
    this.selectedFiles = file;
    // Add logic to process or validate the file if needed
  }
}
