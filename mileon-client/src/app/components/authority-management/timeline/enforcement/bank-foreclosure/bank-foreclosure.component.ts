import { Component, OnInit } from '@angular/core';
import { BankForeclosureSteps } from '../../../../../types/enum/timelineSettings.enum';
import { BankForeclosureForm, EarlyNoticeForm } from '../../../../../types/timeline-settings/timeline-form.model';
import { DescriptionStep } from '../../../../../types/timeline-settings/timeline-settings-types';
import { ConfigTableComponent } from "../../config-table/config-table.component";
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-bank-foreclosure',
  templateUrl: './bank-foreclosure.component.html',
  styleUrls: ['./bank-foreclosure.component.scss'],
  imports: [ConfigTableComponent, DescriptionBoxComponent],
})
export class BankForeclosureComponent implements OnInit {
  constructor() {}

  title: string = '';
  descriptionSteps: DescriptionStep[] = [
    { step: BankForeclosureSteps.stepOne },
    { step: BankForeclosureSteps.stepTwo },
  ];
  inputFields = BankForeclosureForm;

  ngOnInit(): void {}
}
