import { Pipe, PipeTransform } from '@angular/core';
import { userTypeMap } from '../types/maps/userMaps';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: number): unknown {
    return userTypeMap.get(value);
  }

}
