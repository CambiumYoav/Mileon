import { Pipe, PipeTransform } from '@angular/core';
import { LookupService } from '../services/lookup.service';

@Pipe({
  name: 'vehicleType'
})
export class VehicleTypePipe implements PipeTransform {

  constructor(private lookupService:LookupService){}

  transform(value: number): unknown {
    return this.lookupService.VehicleTypeMap.get(value);
  }

}
