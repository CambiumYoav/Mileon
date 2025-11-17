import { Injectable } from '@angular/core';
import { ParkingPermitTable } from '../../../types/parkingPermit/parking-permit-table.model';
import { Column } from '../../../types/table';

@Injectable({
  providedIn: 'root',
})
export class ParkingPermitsTableService {
  table: ParkingPermitTable = ParkingPermitTable;

  columns: Column[];

  constructor() {
    this.columns = ParkingPermitTable.ParkingPermitColumns;
  }
}
