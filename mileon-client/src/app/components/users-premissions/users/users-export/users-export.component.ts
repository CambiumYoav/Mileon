import { Component, OnInit, inject, signal } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConstPath } from '../../../../constants/const_path';
import { ButtonComponent } from "../../../shared/base/button/button.component";
import { UsersInitialDescription } from "../../../../types/enum/userEnums";
import { TitlesEnum } from "../../../../types/enum/titlesEnum";

@Component({
  selector: 'app-users-export',
  templateUrl: './users-export.component.html',
  styleUrls: ['./users-export.component.scss'],
  imports: [ButtonComponent],
})
export class UsersExportComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<UsersExportComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly data = inject(MAT_DIALOG_DATA) as { description: string };

  readonly Icons = ConstPath;
  readonly title = TitlesEnum.UsersExportTitle;

  readonly description = signal<string>(
    this.data?.description || 
    UsersInitialDescription.USERSExport
  );

  ngOnInit(): void {}

  onSubmit() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
