import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AdminApprovedToEnforceSteps,
  TimelineSettingsEnum,
} from '../../../../../types/enum/timelineSettings.enum';
import { DescriptionStep } from '../../../../../types/timeline-settings/timeline-settings-types';
import { DescriptionBoxComponent } from "../../description-box/description-box.component";

@Component({
  selector: 'app-admin-approved-to-enforce',
  templateUrl: './admin-approved-to-enforce.component.html',
  styleUrls: ['./admin-approved-to-enforce.component.scss'],
  standalone: true,
  imports: [CommonModule, DescriptionBoxComponent],
})
export class AdminApprovedToEnforceComponent {
  title: string = TimelineSettingsEnum.AdminApprovedToEnforce;
  descriptionSteps: DescriptionStep[] = [
    { step: AdminApprovedToEnforceSteps.stepOne },
  ];
}
