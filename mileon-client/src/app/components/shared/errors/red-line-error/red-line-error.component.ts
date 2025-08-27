import { Component, OnInit } from '@angular/core';
import { BaseErrorComponent } from '../base-error.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-red-line-error',
  templateUrl: './red-line-error.component.html',
  styleUrls: ['./red-line-error.component.scss'],
  standalone: true,
  imports: [CommonModule],
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
