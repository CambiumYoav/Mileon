import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionGroupDeleteRefuseComponent } from './permission-group-delete-refuse.component';

describe('PermissionGroupDeleteRefuseComponent', () => {
  let component: PermissionGroupDeleteRefuseComponent;
  let fixture: ComponentFixture<PermissionGroupDeleteRefuseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionGroupDeleteRefuseComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupDeleteRefuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals with correct values', () => {
    expect(component.isVisible()).toBeTrue();
    expect(component.message()).toBe('permission-group-delete-refuse works!');
  });

  it('should emit componentReady on construction', () => {
    spyOn(component.componentReady, 'emit');
    const newComponent = new PermissionGroupDeleteRefuseComponent();
    expect(newComponent.componentReady.emit).toHaveBeenCalledWith(true);
  });

  it('should update isVisible signal', () => {
    component.isVisible.set(false);
    expect(component.isVisible()).toBeFalse();
  });
});
