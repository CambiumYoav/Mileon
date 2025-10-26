import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PaymentNoticeSteps,
  TimelineSettingsEnum,
} from '../../../../../types/enum/timelineSettings.enum';
import { DescriptionStep } from '../../../../../types/timeline-settings/timeline-settings-types';
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-payment-notice',
  templateUrl: './payment-notice.component.html',
  styleUrls: ['./payment-notice.component.scss'],
  standalone: true,
  imports: [CommonModule, DescriptionBoxComponent],
})
export class PaymentNoticeComponent {
  title: string = TimelineSettingsEnum.PaymentNotice;
  descriptionSteps: DescriptionStep[] = [
    { step: PaymentNoticeSteps.stepOne },
    { step: PaymentNoticeSteps.stepTwo },
    { step: PaymentNoticeSteps.stepThree },
  ];
}
