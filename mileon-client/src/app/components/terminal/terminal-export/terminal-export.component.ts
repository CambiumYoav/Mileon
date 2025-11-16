import { Component, Inject, signal, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConstPath } from '../../../constants/const_path';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { TerminalInitialDescription } from '../../../types/enum/terminalEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
  
@Component({
  selector: 'app-terminal-export',
  templateUrl: './terminal-export.component.html',
  styleUrls: ['./terminal-export.component.scss'],
  imports: [ButtonComponent],
})
export class TerminalExportComponent {
  Icons = ConstPath;
  
  private readonly _title = signal<string>(TitlesEnum.ExportFileTitle);
  private readonly _description = signal<string>('');
  private readonly _exportData = signal<any>(null);
  private readonly _isExporting = signal<boolean>(false);

  get title(): string {
    return this._title();
  }

  get description(): string {
    return this._description();
  }

  get exportData(): any {
    return this._exportData();
  }

  get isExporting(): boolean {
    return this._isExporting();
  }

  public readonly dialogRef = inject(MatDialogRef<TerminalExportComponent>);
  private readonly dialog = inject(MatDialog);
  public readonly data = inject<{ description: string }>(MAT_DIALOG_DATA);

  constructor() {
    const initialDescription = this.data?.description ||
      TerminalInitialDescription.TICKET_BOOKS_ASSIGNED;
    this._description.set(initialDescription);
  } 

  ngOnInit(): void {}

  onSubmit() {
    this._isExporting.set(true);
    
    // Just close with true
    this.dialogRef.close(true);
    
    this._isExporting.set(false);
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
