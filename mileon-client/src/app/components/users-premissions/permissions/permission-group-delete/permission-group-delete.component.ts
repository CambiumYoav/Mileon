import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from "../../../shared/base/button/button.component";

@Component({
  selector: 'app-permission-group-delete',
  templateUrl: './permission-group-delete.component.html',
  styleUrls: ['./permission-group-delete.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent]
})
export class PermissionGroupDeleteComponent {
  private readonly dialogRef = inject(MatDialogRef<PermissionGroupDeleteComponent>);
  
  isDeleting = signal<boolean>(false);
  
  deleteConfirmed = output<boolean>();
  deleteCancelled = output<boolean>();

  onCancel(): void {
    this.deleteCancelled.emit(true);
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.isDeleting.set(true);
    this.deleteConfirmed.emit(true);
    this.dialogRef.close(true);
  }
}
