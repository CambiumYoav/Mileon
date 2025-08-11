import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ButtonTypes,
  ButtonTypesEnum,
} from '../../../../types/enum/button.enum';
import { SharedImports } from '../../../../shared/shared-modules';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() buttonClass = 'primary-btn';
  @Input() sizeClass = 'button-base';
  @Input() iconSizeClass = 'button-icon-base';
  @Input() buttonText: string = '';
  @Input() imgSrc: string = '';
  @Input() tooltipText: string = '';
  @Input() tooltipClass: string = '';
  @Input() isDisabled: boolean | null = null;
  @Input() loading: boolean = false;
  @Input() buttonType: ButtonTypes = ButtonTypesEnum.Button;
  @Output() clickFunction = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
