import { TestBed } from '@angular/core/testing';

import { InventoryManagementTableService } from './inventory-management-table.service';

describe('InventoryManagementTableService', () => {
  let service: InventoryManagementTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryManagementTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
