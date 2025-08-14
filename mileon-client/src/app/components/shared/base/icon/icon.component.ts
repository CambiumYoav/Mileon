import { Component, Input } from '@angular/core';
import { Icon } from '../../../../types/icon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input()
  icon!: Icon;

  @Input()
  cssClass: string = '';

  constructor() { }

}
