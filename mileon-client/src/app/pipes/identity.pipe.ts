import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'renderIdentity'
})
export class RenderIdentityPipe implements PipeTransform {
  transform(citizen: any): string {
    return citizen?.nid ?? citizen?.passportID ?? citizen?.cn ?? 'N/A';
  }
}
