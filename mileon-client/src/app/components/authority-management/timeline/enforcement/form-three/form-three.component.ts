import { Component, OnInit } from '@angular/core';
import { FormThreeSteps } from '../../../../../types/enum/timelineSettings.enum';
import {
  EarlyNoticeForm,
  FormThreeForm,
} from '../../../../../types/timeline-settings/timeline-form.model';
import { DescriptionStep } from '../../../../../types/timeline-settings/timeline-settings-types';
import { ConfigTableComponent } from "../../config-table/config-table.component";
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-form-three',
  templateUrl: './form-three.component.html',
  styleUrls: ['./form-three.component.scss'],
  imports: [ConfigTableComponent, DescriptionBoxComponent],
})
export class FormThreeComponent implements OnInit {
  constructor() {}

  title: string = '';
  descriptionSteps: DescriptionStep[] = [
    { step: FormThreeSteps.stepOne },
    { step: FormThreeSteps.stepTwo },
    { step: FormThreeSteps.stepThree },
  ];
  inputFields = FormThreeForm;

  ngOnInit(): void {}
}
