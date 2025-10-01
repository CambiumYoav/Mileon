import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremissionsAdminComponent } from './premissions-admin.component';

describe('PremissionsAdminComponent', () => {
  let component: PremissionsAdminComponent;
  let fixture: ComponentFixture<PremissionsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremissionsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremissionsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
