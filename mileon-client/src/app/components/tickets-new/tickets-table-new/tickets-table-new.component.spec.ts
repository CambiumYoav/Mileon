import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTableNewComponent } from './tickets-table-new.component';

describe('TicketsTableNewComponent', () => {
  let component: TicketsTableNewComponent;
  let fixture: ComponentFixture<TicketsTableNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsTableNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsTableNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
