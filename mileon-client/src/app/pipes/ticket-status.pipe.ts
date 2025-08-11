import { Pipe, PipeTransform } from '@angular/core';
import { LookupService } from '../services/lookup.service';

@Pipe({
  name: 'ticketStatus'
})
export class TicketStatusPipe implements PipeTransform {
  constructor(private lookupService:LookupService){

  }
  transform(value: number): any {
    return this.lookupService.ticketStatusMap.get(value);
  }
}