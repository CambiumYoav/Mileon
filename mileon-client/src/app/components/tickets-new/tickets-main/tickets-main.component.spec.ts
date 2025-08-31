import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsMainComponent } from './tickets-main.component';

describe('TicketsMainComponent', () => {
  let component: TicketsMainComponent;
  let fixture: ComponentFixture<TicketsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
