import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConstPath } from '../../../constants/const_path';
import { ModalMessages } from '../../../constants/modalMessages';
import { RouterService } from '../../../services/router.service';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { ParkingPermitFlowService } from '../parking-permit-flow.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-parking-permit-create',
  imports: [ConfirmationModalComponent, RouterOutlet],
  styleUrl: './parking-permit-create.component.scss',
  template: `<div class="container-lg p-4">
      <div class="row pb-4 align-items-center position-relative">
        <div class="col d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center">
            <div class="arrow-container" (click)="openModal()">
              <img [src]="Icons.ARROW_LEFT" />
            </div>
          
            <span class="heading" >
              {{ title }}
            </span>
            
          </div>
        </div>
      </div>

      <div class="row">
        <router-outlet></router-outlet>
      </div>
    </div>

    <app-confirmation-modal
      [isModalOpen]="isExitModalOpen"
      (onConfirm)="back()"
      (isModalClosed)="closeModal()"
      [title]="modalTitle"
      [message]="modalText"
      [confirmLabel]="'אישור'"
      [cancelLabel]="'ביטול'"
    ></app-confirmation-modal> `,
})
export class ParkingPermitCreateComponent {
  Icons = ConstPath;
  form: any;
  formRecreationTrigger = 0;
  title: string = TitlesEnum.ParkingPermitCreateTitle;
  isExitModalOpen = false;
  modalTitle = ModalMessages.CREATE_PARKING_PERMIT;
  modalText = ModalMessages.EXIT_PARKING_PERMIT;
  private readonly routerService = inject(RouterService);
  private readonly parkingPermitFlowService = inject(ParkingPermitFlowService);
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {
    // Always reset when leaving the create flow completely
    // this.parkingPermitFlowService.resetFlow();
  }

  back() {
    // Reset flow when user explicitly exits
    // this.parkingPermitFlowService.resetFlow();
    this.routerService.navigateToHome();
  }

  openModal() {
    this.isExitModalOpen = true;
  }

  closeModal() {
    this.isExitModalOpen = false;
  }
}
