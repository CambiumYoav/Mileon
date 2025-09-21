
import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConstPath } from '../../../../constants/const_path';
import { ButtonComponent } from "../../../shared/base/button/button.component";
import { TitlesEnum } from "../../../../types/enum/titlesEnum";
import { FieldTypeEnum } from "../../../../types/advanced-search/form-tab.model";

@Component({
  selector: 'app-users-after-import',
  templateUrl: './users-after-import.component.html',
  styleUrls: ['./users-after-import.component.scss'],
  imports: [ButtonComponent],
})
export class UsersAfterImportComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<UsersAfterImportComponent>);
  private readonly data = inject(MAT_DIALOG_DATA) as { totalRecords: string; successfulRecords: string; errorRecords: string };

  readonly Icons = ConstPath;
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly title = TitlesEnum.UsersAfterImportTitle;

  readonly isDownloadReport = signal<boolean>(false);
  readonly totalRecords = signal<string>(this.data?.totalRecords || '');
  readonly successfulRecords = signal<string>(this.data?.successfulRecords || '');
  readonly errorRecords = signal<string>(this.data?.errorRecords || '');

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close();
  }

  onLinkClick() {
    this.isDownloadReport.set(true);
    this.dialogRef.close({ isDownloadReport: true });
  }
}
