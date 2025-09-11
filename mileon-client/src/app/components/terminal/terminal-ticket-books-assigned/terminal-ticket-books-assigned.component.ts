import { Component, Inject, signal, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ConstPath } from '../../../constants/const_path';
import { ButtonComponent } from "../../shared/base/button/button.component";

@Component({
  selector: 'app-terminal-ticket-books-assigned',

  templateUrl: './terminal-ticket-books-assigned.component.html',
  styleUrls: ['./terminal-ticket-books-assigned.component.scss'],
  imports: [ButtonComponent],
})
export class TerminalTicketBooksAssignedComponent {
  readonly Icons = ConstPath;
  
  private readonly _title = signal<string>('');
  private readonly _ticketBookId = signal<string>('');
  private readonly _assignedTickets = signal<any[]>([]);
  private readonly _bookNumber = signal<string>('');
  private readonly _isExport = signal<boolean>(false);
  private readonly _exportData = signal<any>(null);

  get title(): string {
    return this._title();
  }

  get ticketBookId(): string {
    return this._ticketBookId();
  }

  get assignedTickets(): any[] {
    return this._assignedTickets();
  }

  get bookNumber(): string {
    return this._bookNumber();
  }

  get isExport(): boolean {
    return this._isExport();
  }

  get exportData(): any {
    return this._exportData();
  }

  public readonly dialogRef = inject(MatDialogRef<TerminalTicketBooksAssignedComponent>);
  public readonly data = inject<{
    ticketBookId: string;
    assignedTickets: any[];
    bookNumber: string;
  }>(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);

  constructor() {
    this._ticketBookId.set(this.data.ticketBookId);
    this._assignedTickets.set(this.data.assignedTickets);
    this._bookNumber.set(this.data.bookNumber);
  }

  ngOnInit(): void {}
  
  onNoClick(): void {
    this.dialog.closeAll();
  }

  onExportClick() {
    this._isExport.set(true);
    const exportData = { isExport: this.isExport };
    this._exportData.set(exportData);
    this.dialogRef.close(exportData);
  }

  onSubmit(): void {
    const submitData = { isExportClicked: this.isExport };
    this._exportData.set(submitData);
    this.dialogRef.close(submitData);
  }
}
