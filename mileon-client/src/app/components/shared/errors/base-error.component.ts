import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-error',
  templateUrl: './base-error.component.html',
  styleUrls: ['./base-error.component.scss'],
})
export class BaseErrorComponent {
  @Input() errorMsg: string = '';

  constructor() {}
}
