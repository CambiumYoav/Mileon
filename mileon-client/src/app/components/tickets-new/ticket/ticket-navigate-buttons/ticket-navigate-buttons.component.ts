import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Ticket } from '../../../../types/ticket';
import { SystemEnum } from '../../../../types/enum/systemEnums';
import { TicketTypeEnum } from '../../../../types/enum/ticketEnums';
import { TicketActionButtonsComponent } from '../ticket-action-buttons/ticket-action-buttons.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ticket-navigate-buttons',
  templateUrl: './ticket-navigate-buttons.component.html',
  styleUrls: ['./ticket-navigate-buttons.component.scss'],
  imports:[TicketActionButtonsComponent,CommonModule],
})
export class TicketNavigateButtonsComponent implements OnInit {
  @Input() renderActionButtons: boolean = true;
  @Input() ticketTypeID: number=0
  @Input() selectedButton: string=''
  @Input() ticketsChecked: Ticket[] = []
  @Input() selectedTicketIdFromTable: string=''
  @Input() errorContent: string='';
  @Input() sumFineAmount=0
  @Input() fromTable: boolean = false;
  @Input() showForTicket: boolean = true
  @Output() selectButton = new EventEmitter()
  @Output() pay = new EventEmitter()
  systemEnum = SystemEnum
  ticketTypeEnum = TicketTypeEnum

  constructor() { }

  ngOnInit(): void {
  }

  selectBtn(btn: string){
    this.selectedButton = btn
    this.selectButton.emit(btn)
  }

}
