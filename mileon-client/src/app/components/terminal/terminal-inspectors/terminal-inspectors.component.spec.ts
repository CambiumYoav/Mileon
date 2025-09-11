import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalInspectorsComponent } from './terminal-inspectors.component';

describe('TerminalInspectorsComponent', () => {
  let component: TerminalInspectorsComponent;
  let fixture: ComponentFixture<TerminalInspectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalInspectorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalInspectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
