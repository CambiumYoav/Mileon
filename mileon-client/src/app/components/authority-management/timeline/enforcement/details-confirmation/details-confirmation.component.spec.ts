import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsConfirmationComponent } from './details-confirmation.component';

describe('DetailsConfirmationComponent', () => {
  let component: DetailsConfirmationComponent;
  let fixture: ComponentFixture<DetailsConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
