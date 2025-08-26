import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ConstPath } from '../../../constants/const_path';
import { SharedImports } from '../../../shared/shared-modules';
import { ButtonComponent } from "../../shared/base/button/button.component";

@Component({
  selector: 'app-infrastructure-export',
  templateUrl: './infrastructure-export.component.html',
  styleUrls: ['./infrastructure-export.component.scss'],
  imports: [SharedImports, ButtonComponent],
})
export class InfrastructureExportComponent implements OnInit {
  Icons = ConstPath;
  dataSubject = new Subject<any>(); 
  title: string = 'יצוא מבנה קובץ';
  description: string = '';
  isSignsExport: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InfrastructureExportComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { description: string; isSignsExport?: boolean }
  ) {
    this.description = data?.description || 'קוד, תיאור, סטטוס קוד לאוטומציה'; // Default value
    this.isSignsExport = data?.isSignsExport || false;
  }

  ngOnInit(): void {}

  onSubmit() {
    this.dataSubject.next('');
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
