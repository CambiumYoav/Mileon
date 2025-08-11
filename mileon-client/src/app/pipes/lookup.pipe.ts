import { Pipe, PipeTransform } from '@angular/core';
import { LookupService } from '../services/lookup.service';

@Pipe({
  name: 'lookup'
})
export class LookupPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  constructor (private lookupService:LookupService) {}
  
  drinks = {
    'coke': function () {
      return 'Coke';
    },
    'pepsi': function () {
      return 'Pepsi';
    },
    'lemonade': function () {
      return 'Lemonade';
    }
  };

  transform(value: number, type: string): any {
    return this.lookupService.ticketTypesMap.get(value);
  }

}
