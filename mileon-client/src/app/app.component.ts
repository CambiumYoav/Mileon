import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from './constants/const_path';
import { BaseComponents, SharedImports, SharedModules } from './shared/shared-modules';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [ BaseComponents, SharedImports],
})
export class AppComponent {
  title = 'mileon-client';
  Icons = ConstPath;
  constructor(private toastr: ToastrService) {}
  ngOnInit() {
    this.showSuccess();
    this.showError();
  }
  showSuccess() {
    this.toastr.success('הפעולה הושלמה בהצלחה!');
  }
  showError() {
    this.toastr.error('משהו השתבש.');
  }
}
