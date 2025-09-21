import { Component, OnInit, inject, signal } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConstPath } from '../../../../constants/const_path'; 
import { FileType } from '../../../../types/enum/fileType.enum';
import { IdValuePair } from '../../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../../types/uploadedFile';
import { ButtonComponent } from "../../../shared/base/button/button.component";
import { FileUploadNewComponent } from "../../../shared/base/upload-files/upload-files.component";
import { TitlesEnum } from "../../../../types/enum/titlesEnum";
import { UsersInitialDescription } from "../../../../types/enum/userEnums";

@Component({
  selector: 'app-users-import',
  templateUrl: './users-import.component.html',
  styleUrls: ['./users-import.component.scss'],
  imports: [ButtonComponent, FileUploadNewComponent],
})
export class UsersImportComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<UsersImportComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly data = inject(MAT_DIALOG_DATA) as { description: string };

  readonly Icons = ConstPath;
  readonly FileType = FileType;
  readonly title = TitlesEnum.UsersImportTitle;

  readonly description = signal<string>(
    this.data?.description ||
    UsersInitialDescription.USERSImport
  );
  readonly selectedFiles = signal<File | null>(null);
  readonly fileTypes = signal<IdValuePair[]>([]);
  readonly filesToUpload = signal<UploadedFile[]>([]);

  ngOnInit(): void {}

  onSubmit() {
    this.dialogRef.close({ uploadedFiles: this.selectedFiles() });
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  getUploadedFile(file: File): void {
    // console.log('File received from child component:', file);
    this.selectedFiles.set(file);
    // Add logic to process or validate the file if needed
  }
}
