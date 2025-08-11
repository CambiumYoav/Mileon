import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from './constants/const_path';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // 👈 plural
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
