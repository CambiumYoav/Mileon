import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedImports } from '../../../shared/shared-modules';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  constructor() {}

  ngOnInit(): void {}
}
