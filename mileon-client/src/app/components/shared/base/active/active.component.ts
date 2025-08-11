import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SharedImports } from '../../../../shared/shared-modules';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss'],
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveComponent implements OnInit {

  constructor() { }

  @Input() isActive:boolean = false;

  ngOnInit(): void {
  }

}
