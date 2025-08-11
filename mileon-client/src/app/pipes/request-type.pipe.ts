import { Pipe, PipeTransform } from '@angular/core';
import {LegalRequestTypeMappingToString} from "../constants/legal-request-type-mapping";


@Pipe({
  name: 'requestType'
})
export class RequestTypePipe implements PipeTransform {

  transform(value: number): string {
    return LegalRequestTypeMappingToString[value] || 'סוג בקשה לא מזוהה';
  }

}
