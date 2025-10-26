import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFieldSize } from '../../../../../types/enum/infrastructureTablesEnum';
import {
  EarlyNoticeSteps,
  InformationAuthSteps,
  TimelineSettingsEnum,
} from '../../../../../types/enum/timelineSettings.enum';
import { DynamicField } from '../../../../../types/infrastructure/InfrastructureTypes';
import {
  DescriptionStep,
  TableConfig,
} from '../../../../../types/timeline-settings/timeline-settings-types';
import { TimelineSettingsFormService } from '../../../timeline-settings-form.service';
import { EarlyNoticeForm } from '../../../../../types/timeline-settings/timeline-form.model';
import { ConfigTableComponent } from "../../config-table/config-table.component";
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-early-notice',
  templateUrl: './early-notice.component.html',
  styleUrls: ['./early-notice.component.scss'],
  standalone: true,
  imports: [CommonModule, ConfigTableComponent, DescriptionBoxComponent],
})
export class EarlyNoticeComponent {
  title: string = '';
  descriptionSteps: DescriptionStep[] = [
    { step: EarlyNoticeSteps.stepOne },
    { step: EarlyNoticeSteps.stepTwo },
    { step: EarlyNoticeSteps.stepThree },
  ];
  inputFields = EarlyNoticeForm;
}
