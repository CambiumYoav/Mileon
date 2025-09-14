import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { InspectorTaskResponse } from '../../../types/inspectorTask';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TaskPreviewComponent {
  Icons = ConstPath;
  isExpanded = signal(false);
  task = input.required<InspectorTaskResponse>();

  date = computed(() => {
    const dateObj = new Date(this.task().taskCreationDate);
    return dateObj.toLocaleDateString('he-IL');
  });

  time = computed(() => {
    const dateObj = new Date(this.task().taskCreationDate);
    return dateObj.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  toggleAccordion(): void {
    this.isExpanded.set(!this.isExpanded());
  }
}
