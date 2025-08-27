import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownWindowComponent } from './dropdown-window.component';

describe('DropdownWindowComponent', () => {
  let component: DropdownWindowComponent;
  let fixture: ComponentFixture<DropdownWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
