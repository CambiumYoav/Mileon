import { TestBed } from '@angular/core/testing';

import { InventoryManagementSearchService } from './inventory-management-search.service';

describe('InventoryManagementSearchService', () => {
  let service: InventoryManagementSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryManagementSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
