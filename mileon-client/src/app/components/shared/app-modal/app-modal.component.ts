// app-modal.component.ts

import {
  Component,
  input,
  output,
  viewChild,
  ElementRef,
  effect,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstPath } from '../../../constants/const_path';
import { TicketPaymentBalance } from '../../../types/payments/payment';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../base/button/button.component";

interface ModalButton {
  label: string;
  action: () => void;
  buttonClass?: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModalComponent {
  title = input<string>('');
  message = input<string>('');
  buttons = input<ModalButton[]>([]);
  isModalOpen = input<boolean>(false);
  modalSize = input<'sm' | 'lg' | 'xl' | 'full' | string>('sm');
  amountData = input<TicketPaymentBalance | undefined>(undefined);
  hideExitIcon = input<boolean>(false);

  isModalClosed = output<void>();

  content = viewChild<ElementRef>('content');

  icons = signal(ConstPath);
  modalOptions = computed(() => ({
    ariaLabelledBy: 'modal-basic-title',
    centered: true,
    backdrop: 'static' as const,
    keyboard: false,
    size: this.modalSize()
  }));

  constructor(private modalService: NgbModal) {
    effect(() => {
      if (this.isModalOpen()) {
        setTimeout(() => this.open(), 0);
      }
    });
  }

  onButtonsChange(buttonsData: ModalButton[]) {
  }

  open() {
    const contentRef = this.content();
    if (!contentRef) {
      console.warn('Modal content template not found');
      return;
    }

    this.modalService.open(contentRef, this.modalOptions()).result.then(
      () => {
        this.isModalClosed.emit();
      },
      () => {
        this.isModalClosed.emit();
      }
    );
  }

  buttonClicked(button: ModalButton) {
    button.action();
    this.modalService.dismissAll();
  }

  protected readonly ConstPath = ConstPath;
}
