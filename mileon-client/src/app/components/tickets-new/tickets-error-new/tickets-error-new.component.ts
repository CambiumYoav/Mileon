import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MaterialModule } from '../../../shared/material-module';
import { ConstPath } from '../../../constants/const_path';

@Component({
  selector: 'app-tickets-error-new',
  templateUrl: './tickets-error-new.component.html',
  styleUrls: ['./tickets-error-new.component.scss'],
  imports:[MaterialModule]
})
export class TicketsErrorNewComponent implements OnInit {
  @Output() closeError = new EventEmitter();
  @Input() errorMessage='';
  errorSvg = ConstPath.ERROR;

  constructor() {}

  ngOnInit(): void {}
}
