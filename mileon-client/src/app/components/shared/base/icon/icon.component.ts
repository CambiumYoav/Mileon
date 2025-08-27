import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../../types/icon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class IconComponent {
  @Input()
  icon?: Icon;

  @Input()
  cssClass: string = '';

  @Input()
  size: 'small' | 'large' = 'large';

  constructor() { }

}
