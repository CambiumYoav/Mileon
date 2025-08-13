import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RadioButtonComponent } from './radio-button.component';

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtonComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit value change when radio is selected', () => {
    const spy = jest.spyOn(component.valueChange, 'emit');
    component.onRadioChange('test-value');
    expect(spy).toHaveBeenCalledWith('test-value');
  });

  it('should set value when writeValue is called', () => {
    component.writeValue('new-value');
    expect(component.value).toBe('new-value');
  });

  it('should return correct container class', () => {
    component.direction = 'vertical';
    expect(component.getContainerClass()).toContain('vertical');
    
    component.direction = 'horizontal';
    expect(component.getContainerClass()).toContain('horizontal');
  });
});
