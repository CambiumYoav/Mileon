import { Pipe, PipeTransform } from '@angular/core';
import { LookupService } from '../services/lookup.service';

@Pipe({
  name: 'ticketType'
})
export class TicketTypePipe implements PipeTransform {
  constructor(private lookupService:LookupService){

  }
  transform(value: number): any {
    return this.lookupService.ticketTypesMap.get(value);
  }
}
