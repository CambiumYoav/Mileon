import { Component, OnInit } from '@angular/core';
import {
  DetailsConfirmationSteps,
  TimelineSettingsEnum,
} from '../../../../../types/enum/timelineSettings.enum';
import { DescriptionStep } from '../../../../../types/timeline-settings/timeline-settings-types';
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-details-confirmation',
  templateUrl: './details-confirmation.component.html',
  styleUrls: ['./details-confirmation.component.scss'],
  imports: [DescriptionBoxComponent],
})
export class DetailsConfirmationComponent implements OnInit {
  title: string = TimelineSettingsEnum.DetailsConfirmation;
  descriptionSteps: DescriptionStep[] = [
    { step: DetailsConfirmationSteps.send },
    { step: DetailsConfirmationSteps.complete },
    { step: DetailsConfirmationSteps.error },
  ];

  constructor() {}

  ngOnInit(): void {}
}
