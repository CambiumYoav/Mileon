import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../../constants/const_path';
import { DescriptionStep } from '../../../../types/timeline-settings/timeline-settings-types';

@Component({
  selector: 'app-description-box',
  templateUrl: './description-box.component.html',
  styleUrls: ['./description-box.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DescriptionBoxComponent {
  @Input() title: string = '';
  @Input() descriptionSteps: DescriptionStep[] = [];
  
  Icons = ConstPath;
}
