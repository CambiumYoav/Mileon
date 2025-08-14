import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedLineErrorComponent } from './red-line-error.component';

describe('RedLineErrorComponent', () => {
  let component: RedLineErrorComponent;
  let fixture: ComponentFixture<RedLineErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedLineErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedLineErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
