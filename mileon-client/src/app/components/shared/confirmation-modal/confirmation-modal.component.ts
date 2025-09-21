import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppModalComponent } from "../app-modal/app-modal.component";
import { ConstPath } from '../../../constants/const_path';
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [AppModalComponent, CommonModule],
})
export class ConfirmationModalComponent {
  Icons = ConstPath;

  @Input() isModalOpen: boolean = false;
  @Input() title: string = ModalMessages.UPDATE_SETTINGS;
  @Input() message: string = 'האם לשמור את השינויים?';
  @Input() showDangerIcon: boolean = true;
  @Input() modalSize: string = 'md';
  @Input() cancelLabel: string = 'ביטול';
  @Input() confirmLabel: string = 'שמור שינויים';
  @Input() cancelButtonClass: string = 'outline-secondary-btn';
  @Input() confirmButtonClass: string = '';

  @Output() onCancel = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
  @Output() isModalClosed = new EventEmitter<void>();

  modalButtons: ModalButton[] = [];

  ngOnInit() {
    this.createModalButtons();
  }

  ngOnChanges() {
    this.createModalButtons();
  }

  createModalButtons(): ModalButton[] {
    this.modalButtons = [
      {
        label: this.cancelLabel,
        action: () => this.cancel(),
        buttonClass: this.cancelButtonClass,
      },
      {
        label: this.confirmLabel,
        action: () => this.confirm(),
        buttonClass: this.confirmButtonClass,
      },
    ];
    return this.modalButtons;
  }

  cancel() {
    this.onCancel.emit();
    this.closeModal();
  }

  confirm() {
    this.onConfirm.emit();
    this.closeModal();
  }

  closeModal() {
    this.isModalOpen = false;
    this.isModalClosed.emit();
  }
}
