import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-tooltip',
  templateUrl: './step-tooltip.component.html',
  styleUrls: ['./step-tooltip.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class StepTooltipComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() last?: boolean = false;
  show: boolean = false;
}
