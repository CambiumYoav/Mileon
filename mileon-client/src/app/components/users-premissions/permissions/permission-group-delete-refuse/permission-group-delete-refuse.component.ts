import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permission-group-delete-refuse',
  templateUrl: './permission-group-delete-refuse.component.html',
  styleUrls: ['./permission-group-delete-refuse.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PermissionGroupDeleteRefuseComponent {
  isVisible = signal<boolean>(true);
  message = signal<string>('permission-group-delete-refuse works!');
  
  componentReady = output<boolean>();

  constructor() {
    this.componentReady.emit(true);
  }
}
