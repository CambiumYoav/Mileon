import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthorityService } from '../../../services/authority.service ';
import { AuthorityManagementSearchService } from '../authority-management-search/authority-management-search.service';
import { AuthorityManagementService } from '../authority-management.service';
import { RouterService } from '../../../services/router.service';

import { AuthorityManagementDraftsAndLettersComponent } from './authority-management-drafts-and-letters.component';

describe('AuthorityManagementDraftsAndLettersComponent', () => {
  let component: AuthorityManagementDraftsAndLettersComponent;
  let fixture: ComponentFixture<AuthorityManagementDraftsAndLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementDraftsAndLettersComponent],
      providers: [
        { provide: ToastrService, useValue: {} },
        { provide: AuthorityService, useValue: {} },
        { provide: AuthorityManagementSearchService, useValue: {} },
        { provide: AuthorityManagementService, useValue: {} },
        { provide: RouterService, useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementDraftsAndLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals with default values', () => {
    expect(component.data()).toEqual([]);
    expect(component.total()).toBe(0);
    expect(component.count()).toBe(0);
    expect(component.loader()).toBe(true);
    expect(component.isExportModalOpen()).toBe(false);
    expect(component.isActiveModalOpen()).toBe(false);
  });

  it('should have correct title', () => {
    expect(component.title).toBe('DraftsAndLettersTitle');
  });

  it('should have modal buttons configured', () => {
    expect(component.modalButtons).toBeDefined();
    expect(component.modalButtons.length).toBeGreaterThan(0);
  });
});
