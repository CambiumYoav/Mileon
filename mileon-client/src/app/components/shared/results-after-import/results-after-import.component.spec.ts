import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsAfterImportComponent } from './results-after-import.component';

describe('UsersAfterImportComponent', () => {
  let component: ResultsAfterImportComponent;
  let fixture: ComponentFixture<ResultsAfterImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultsAfterImportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsAfterImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
