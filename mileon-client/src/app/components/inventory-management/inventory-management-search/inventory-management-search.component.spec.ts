import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementSearchComponent } from './inventory-management-search.component';

describe('InventoryManagementSearchComponent', () => {
  let component: InventoryManagementSearchComponent;
  let fixture: ComponentFixture<InventoryManagementSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryManagementSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryManagementSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
