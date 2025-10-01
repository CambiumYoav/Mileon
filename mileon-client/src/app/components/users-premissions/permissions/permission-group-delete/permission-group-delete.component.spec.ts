import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { PermissionGroupDeleteComponent } from './permission-group-delete.component';

describe('PermissionGroupDeleteComponent', () => {
  let component: PermissionGroupDeleteComponent;
  let fixture: ComponentFixture<PermissionGroupDeleteComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<PermissionGroupDeleteComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [PermissionGroupDeleteComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    })
    .compileComponents();

    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<PermissionGroupDeleteComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals with correct values', () => {
    expect(component.isDeleting()).toBeFalse();
  });

  it('should close dialog with false when onCancel is called', () => {
    spyOn(component.deleteCancelled, 'emit');
    component.onCancel();
    
    expect(component.deleteCancelled.emit).toHaveBeenCalledWith(true);
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true when onDelete is called', () => {
    spyOn(component.deleteConfirmed, 'emit');
    component.onDelete();
    
    expect(component.isDeleting()).toBeTrue();
    expect(component.deleteConfirmed.emit).toHaveBeenCalledWith(true);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});
