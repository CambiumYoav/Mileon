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
import { BaseComponents, SharedImports } from '../../../shared/shared-modules';

@Component({
  selector: 'app-infrastructure-import',
  templateUrl: './infrastructure-import.component.html',
  styleUrls: ['./infrastructure-import.component.scss'],
  standalone: true,
  imports: [BaseComponents, SharedImports],
})
export class InfrastructureImportComponent implements OnInit {
  // Constants and Enums
  readonly Icons = ConstPath;
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly FileType = FileType;
  // Inputs/Outputs
  dataSubject = new Subject<any>(); // Observable to emit data

  // Component State
  title: string = 'יבוא מבנה קובץ';
  description: string;
  selectedFiles: File | null = null;
  fileTypes: IdValuePair[] = [];
  filesToUpload: UploadedFile[] = []; // Tracks files for upload
  isSignsImport: boolean = false;
  isSpecialImport: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InfrastructureImportComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string;
      isSignsImport?: boolean;
      isSpecialImport?: boolean;
    } // Injected data
  ) {
    this.description =
      data?.description ||
      'קוד, ת.זהות, שם פרטי, שם משפחה, ישוב , רחוב, מספר בית, כניסה, דירה, מיקוד , טלפון, טלפון נייד, מייל';
    this.isSignsImport = data?.isSignsImport || false;
    this.isSpecialImport = data?.isSpecialImport || false;
  }

  ngOnInit(): void {}

  // Emits selected files and closes the dialog
  onSubmit(): void {
    this.dialogRef.close({ uploadedFiles: this.selectedFiles });
  }

  // Closes the dialog without submitting
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Handles file upload from child component
  getUploadedFile(file: File): void {
    console.log('File received from child component:', file);
    this.selectedFiles = file;
    // Add logic to process or validate the file if needed
  }
}
