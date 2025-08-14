import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-column.component.html',
  styleUrl: './edit-column.component.scss'
})
export class EditColumnComponent {
  @Output() editClick = new EventEmitter<void>();

  onEditClick(): void {
    this.editClick.emit();
  }
}
