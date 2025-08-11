import { Pipe, PipeTransform } from '@angular/core';
import { inspectorEnforcementActionMap } from '../types/maps/userMaps';

@Pipe({
  name: 'inspectorEnforcementAction'
})
export class InspectorEnforcementActionPipe implements PipeTransform {

  transform(value: number): unknown {
    return inspectorEnforcementActionMap.get(value)
  }

}
