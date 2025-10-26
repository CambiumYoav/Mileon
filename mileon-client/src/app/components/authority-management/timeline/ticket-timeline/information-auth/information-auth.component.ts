import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TimelineSettingsEnum,
  InformationAuthSteps,
} from '../../../../../types/enum/timelineSettings.enum';
import {
  TableConfig,
  DescriptionStep,
} from '../../../../../types/timeline-settings/timeline-settings-types';
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-information-auth',
  templateUrl: './information-auth.component.html',
  styleUrls: ['./information-auth.component.scss'],
  standalone: true,
  imports: [CommonModule, DescriptionBoxComponent],
})
export class InformationAuthComponent {
  components: TableConfig = {
    administrative: [],
    general: [],
    parking: [],
  };

  title: string = TimelineSettingsEnum.InformationAuth;
  descriptionSteps: DescriptionStep[] = [
    { step: InformationAuthSteps.send },
    { step: InformationAuthSteps.complete },
    { step: InformationAuthSteps.error },
  ];
}
