import { Pipe, PipeTransform } from '@angular/core';
import { LookupService } from '../services/lookup.service';

@Pipe({
  name: 'ticketResource'
})
export class TicketSourcePipe implements PipeTransform {

  constructor(private lookupService:LookupService){}
  transform(value: number): unknown {
    return this.lookupService.ticketResourceMap.get(value)
  }

}
