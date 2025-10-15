import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureTabsComponent } from './infrastructure-tabs.component';

describe('InfrastructureTabsComponent', () => {
  let component: InfrastructureTabsComponent;
  let fixture: ComponentFixture<InfrastructureTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
