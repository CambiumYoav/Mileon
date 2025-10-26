import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DescriptionTransportSteps,
  TimelineSettingsEnum,
} from '../../../../../types/enum/timelineSettings.enum';
import {
  DescriptionStep,
  TableConfig,
} from '../../../../../types/timeline-settings/timeline-settings-types';
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-transport-office',
  templateUrl: './transport-office.component.html',
  styleUrls: ['./transport-office.component.scss'],
  standalone: true,
  imports: [CommonModule, DescriptionBoxComponent],
})
export class TransportOfficeComponent {
  components: TableConfig = {
    administrative: [],
    general: [],
    parking: [],
  };

  title: string = TimelineSettingsEnum.TransportOffice;
  descriptionSteps: DescriptionStep[] = [
    { step: DescriptionTransportSteps.send },
    { step: DescriptionTransportSteps.complete },
    { step: DescriptionTransportSteps.error },
  ];
}
