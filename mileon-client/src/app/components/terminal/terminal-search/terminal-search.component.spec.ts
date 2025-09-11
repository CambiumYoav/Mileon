import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSearchComponent } from './terminal-search.component';

describe('TerminalSearchComponent', () => {
  let component: TerminalSearchComponent;
  let fixture: ComponentFixture<TerminalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
