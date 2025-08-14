import { Component, OnInit } from '@angular/core';
import { BaseErrorComponent } from '../base-error.component';

@Component({
  selector: 'app-red-line-error',
  templateUrl: './red-line-error.component.html',
  styleUrls: ['./red-line-error.component.scss'],
})
export class RedLineErrorComponent
  extends BaseErrorComponent
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
