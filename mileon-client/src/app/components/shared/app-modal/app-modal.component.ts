// app-modal.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
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
})
export class AppModalComponent implements OnChanges {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttons: ModalButton[] = [];
  @Input() isModalOpen: boolean = false;
  @Input() modalSize: 'sm' | 'lg' | 'xl' | 'full' | string = 'sm';
  @Input() amountData: TicketPaymentBalance | undefined;
  @Input() hideExitIcon: boolean = false;
  @Output() isModalClosed = new EventEmitter<void>();

  @ViewChild('content', { static: true }) content!: ElementRef;

  Icons = ConstPath;

  constructor(private modalService: NgbModal) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isModalOpen'] && changes['isModalOpen'].currentValue) {
      this.open();
    }
  }

  onButtonsChange(buttonsData: ModalButton[]) {
    this.buttons = buttonsData;
  }
  open() {
    const modalOptions: any = { ariaLabelledBy: 'modal-basic-title' };

    if (this.modalSize) {
      modalOptions.size = this.modalSize;
    }

    this.modalService.open(this.content, modalOptions).result.then(
      (result) => {
        this.isModalClosed.emit();
      },
      (reason) => {
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
