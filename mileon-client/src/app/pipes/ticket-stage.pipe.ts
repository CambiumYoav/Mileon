import { Pipe, PipeTransform } from '@angular/core';
import { LookupService } from '../services/lookup.service';

@Pipe({
  name: 'ticketStage'
})
export class TicketStagePipe implements PipeTransform {

  constructor(private lookupService:LookupService){

  }
  transform(value: number): any {
    return this.lookupService.ticketStageMap.get(value)
  }

}
