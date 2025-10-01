import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionsManagementComponent } from './permissions-management.component';

describe('PermissionsManagementComponent', () => {
  let component: PermissionsManagementComponent;
  let fixture: ComponentFixture<PermissionsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsManagementComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals with correct values', () => {
    expect(component.title()).toBe('GroupsPermissionsTitle');
    expect(component.items()).toHaveSize(3);
    expect(component.expanded()).toHaveSize(3);
    expect(component.hasItems()).toBeTrue();
  });

  it('should toggle item expansion', () => {
    const initialExpanded = component.expanded()[0];
    component.toggleItem(0);
    expect(component.expanded()[0]).toBe(!initialExpanded);
  });

  it('should toggle all items', () => {
    component.toggleAll(true);
    expect(component.allExpanded()).toBeTrue();
    
    component.toggleAll(false);
    expect(component.allCollapsed()).toBeTrue();
  });

  it('should add and remove items', () => {
    const newItem = { title: 'New Item', content: 'New Content' };
    const initialLength = component.items().length;
    
    component.addItem(newItem);
    expect(component.items()).toHaveSize(initialLength + 1);
    expect(component.expanded()).toHaveSize(initialLength + 1);
    
    component.removeItem(0);
    expect(component.items()).toHaveSize(initialLength);
    expect(component.expanded()).toHaveSize(initialLength);
  });

  it('should compute allExpanded correctly', () => {
    component.toggleAll(true);
    expect(component.allExpanded()).toBeTrue();
    
    component.toggleItem(0);
    expect(component.allExpanded()).toBeFalse();
  });
});
