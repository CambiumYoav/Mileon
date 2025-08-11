import { Pipe, PipeTransform } from '@angular/core';
import { LookupService } from '../services/lookup.service';

@Pipe({
  name: 'ticketSubStage'
})
export class TicketSubStagePipe implements PipeTransform {
  constructor(private lookupService:LookupService){}

  transform(value: number): any {
    return this.lookupService.ticketSubStageMap.get(value)?.name
  }

}
