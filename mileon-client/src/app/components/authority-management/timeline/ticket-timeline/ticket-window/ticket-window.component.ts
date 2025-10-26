import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketWindowForm } from '../../../../../types/timeline-settings/timeline-form.model';
import { ConfigTableComponent } from "../../config-table/config-table.component";

@Component({
  selector: 'app-ticket-window',
  templateUrl: './ticket-window.component.html',
  styleUrls: ['./ticket-window.component.scss'],
  standalone: true,
  imports: [CommonModule, ConfigTableComponent],
})
export class TicketWindowComponent {
  inputFields = TicketWindowForm;
}
