import { Component, OnInit } from '@angular/core';
import { OrderMessageSteps } from '../../../../../types/enum/timelineSettings.enum';
import { EarlyNoticeForm, OrderMessageForm } from '../../../../../types/timeline-settings/timeline-form.model';
import { DescriptionStep } from '../../../../../types/timeline-settings/timeline-settings-types';
import { ConfigTableComponent } from "../../config-table/config-table.component";
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-order-message',
  templateUrl: './order-message.component.html',
  styleUrls: ['./order-message.component.scss'],
  imports: [ConfigTableComponent, DescriptionBoxComponent],
})
export class OrderMessageComponent implements OnInit {
  title: string = '';
  descriptionSteps: DescriptionStep[] = [
    { step: OrderMessageSteps.stepOne },
    { step: OrderMessageSteps.stepTwo },
    { step: OrderMessageSteps.stepThree },
  ];
  inputFields = OrderMessageForm;

  constructor() {}

  ngOnInit(): void {}
}
