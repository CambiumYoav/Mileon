import { Component, Input, OnInit } from '@angular/core';
import { SharedImports } from '../../../../../shared/shared-modules';

@Component({
  selector: 'app-step-tooltip',
  templateUrl: './step-tooltip.component.html',
  styleUrls: ['./step-tooltip.component.scss'],
  imports: [
    SharedImports
]
})
export class StepTooltipComponent implements OnInit {
  constructor() {}

  @Input() title?: string;
  @Input() description?: string;
  @Input() last?: boolean = false;
  show: boolean = false;
  ngOnInit(): void {}
}
