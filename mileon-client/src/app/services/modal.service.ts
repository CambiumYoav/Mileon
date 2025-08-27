import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';

export interface ModalData {
  [key: string]: any;
}

export interface ModalConfig {
  component: Type<any>;
  data?: ModalData;
  config?: MatDialogConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalClosedSubject = new Subject<void>();
  modalClosed$ = this.modalClosedSubject.asObservable();

  constructor(private dialog: MatDialog) {}

  openModal(modalConfig: ModalConfig) {
    const defaultConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1200px',
      height: '80%',
      maxHeight: '800px',
      disableClose: false,
      autoFocus: false,
      data: modalConfig.data || {}
    };

    const finalConfig = { ...defaultConfig, ...modalConfig.config };
    
    const dialogRef = this.dialog.open(modalConfig.component, finalConfig);
    
    dialogRef.afterClosed().subscribe(() => {
      this.modalClosedSubject.next();
    });

    return dialogRef;
  }

  closeAllModals() {
    this.dialog.closeAll();
  }

  closeModal() {
    this.modalClosedSubject.next();
  }
}
