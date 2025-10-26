import { Component, OnInit } from '@angular/core';
import { DebtReminderSteps } from '../../../../../types/enum/timelineSettings.enum';
import { DebtReminderForm, EarlyNoticeForm } from '../../../../../types/timeline-settings/timeline-form.model';
import { DescriptionStep } from '../../../../../types/timeline-settings/timeline-settings-types';
import { ConfigTableComponent } from "../../config-table/config-table.component";
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-debt-reminder',
  templateUrl: './debt-reminder.component.html',
  styleUrls: ['./debt-reminder.component.scss'],
  imports: [ConfigTableComponent, DescriptionBoxComponent],
})
export class DebtReminderComponent implements OnInit {
  constructor() {}

  title: string = '';
  descriptionSteps: DescriptionStep[] = [
    { step: DebtReminderSteps.stepOne },
    { step: DebtReminderSteps.stepTwo },
    { step: DebtReminderSteps.stepThree },
  ];
  inputFields = DebtReminderForm;

  ngOnInit(): void {}
}
