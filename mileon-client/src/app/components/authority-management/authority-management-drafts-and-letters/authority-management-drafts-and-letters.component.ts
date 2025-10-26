import { Component, OnInit, OnDestroy, signal, computed, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ConstPath } from '../../../constants/const_path';
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import { AuthorityService } from '../../../services/authority.service ';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { Column } from '../../../types/table';
import { AuthorityManagementService } from '../authority-management.service';
import { AuthorityManagementTable } from '../../../types/management/authority-management-table.model';
import { AuthorityManagementSearchService } from '../authority-management-search/authority-management-search.service';
import { FileTypeExtension } from '../../../types/enum/fileType.enum';
import { Utils } from '../../../utils/utils';
import { DraftsAndLettersFilterOptions } from '../../../types/filters/drafts-and-letters/draftsAndLettersFilter';  
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { RouterService } from '../../../services/router.service';
import {
  DraftsAndLetters,
  DraftsAndLettersList,
} from '../../../types/draftsAndLettersType';
import { DraftsAndLettersTypes } from '../../../types/enum/draftAndLetters.enum';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { CommonModule } from '@angular/common';
import { AuthorityManagementSearchComponent } from '../authority-management-search/authority-management-search.component';
import { AuthorityManagementTableComponent } from '../authority-management-table/authority-management-table.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { AppModalComponent } from '../../shared/app-modal/app-modal.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-authority-management-drafts-and-letters',
  templateUrl: './authority-management-drafts-and-letters.component.html',
  styleUrls: ['./authority-management-drafts-and-letters.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AuthorityManagementSearchComponent,
    AuthorityManagementTableComponent,
    CheckboxComponent,
    ButtonComponent,
    AppModalComponent,
    ConfirmationModalComponent,
  ],
})
export class AuthorityManagementDraftsAndLettersComponent implements OnInit, OnDestroy {
  private readonly _columns = signal<Column[]>([]);
  private readonly _data = signal<DraftsAndLettersList[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _count = signal<number>(0);
  private readonly _searchText = signal<string>('');
  private readonly _filters = signal<DraftsAndLettersFilterOptions>({ currentPage: 1, order: 0 });
  private readonly _isExportModalOpen = signal<boolean>(false);
  private readonly _isActiveModalOpen = signal<boolean>(false);
  private readonly _searchData = signal<DraftsAndLettersFilterOptions | null>(null);
  private readonly _loader = signal<boolean>(true);
  private readonly _filter = signal<DraftsAndLettersFilterOptions | null>(null);
  private readonly _currentAuthority = signal<string | null>(null);
  private readonly _includeInactive = signal<boolean>(false);
  private readonly _selectedDraftAndLetter = signal<DraftsAndLetters | null>(null);
  private readonly _isDraftAndLetterSelected = signal<boolean>(false);
  private readonly _isLetterSelectedIsActive = signal<boolean>(false);
  
  private loadDataAbortController: AbortController | null = null;

  readonly columns = computed(() => this._columns());
  readonly data = computed(() => this._data());
  readonly total = computed(() => this._total());
  readonly count = computed(() => this._count());
  readonly searchText = computed(() => this._searchText());
  readonly filters = computed(() => this._filters());
  readonly isExportModalOpen = computed(() => this._isExportModalOpen());
  readonly isActiveModalOpen = computed(() => this._isActiveModalOpen());
  readonly searchData = computed(() => this._searchData() as any);
  readonly loader = computed(() => this._loader());
  readonly filter = computed(() => this._filter());
  readonly currentAuthority = computed(() => this._currentAuthority());
  readonly includeInactive = computed(() => this._includeInactive());
  readonly selectedDraftAndLetter = computed(() => this._selectedDraftAndLetter());
  readonly isDraftAndLetterSelected = computed(() => this._isDraftAndLetterSelected());
  readonly isLetterSelectedIsActive = computed(() => this._isLetterSelectedIsActive());

  readonly title = TitlesEnum.DraftsAndLettersTitle;
  readonly updateTitle = ModalMessages.UPDATE_DRAFTS_AND_LETTERS;
  readonly isActiveText = ModalMessages.ARE_YOU_SURE_IS_ACTIVE;
  readonly isInActiveText = ModalMessages.ARE_YOU_SURE_IS_INACTIVE;
  readonly Icons = ConstPath;
  readonly exportModalTitle = ModalMessages.EXPORT_FILE;
  readonly modalButtons: ModalButton[] = this.createModalButtons();

  readonly selectedDraftAndLetterData$: Subject<any> = new Subject<any>();

  readonly authorityManagementForm: FormGroup;

  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  private readonly authorityManagementSearchService = inject(AuthorityManagementSearchService);
  private readonly authorityManagementService = inject(AuthorityManagementService);
  private readonly routerService = inject(RouterService);

  constructor() {
    this.authorityManagementForm = this.authorityManagementSearchService.searchForm;
  }

  // Move effects to field initializers to ensure they run in injection context
  private readonly authorityEffect = effect(() => {
    const authorityID = this.authorityService.authorityId();
    if (authorityID) {
      this._currentAuthority.set(authorityID);
      this.loadData(this.authorityManagementSearchService.form.value);
    }
  });

  // Handle selected data changes with effect (Angular 19 signals pattern)
  private readonly selectedDataEffect = effect(() => {
    const selectedData = this.selectedDraftAndLetter();
    if (selectedData) {
      if (selectedData.typeId == DraftsAndLettersTypes.Draft) {
        this._isDraftAndLetterSelected.set(false);
      } else {
        this._isDraftAndLetterSelected.set(true);
      }
    }
  });

  ngOnInit(): void {
    this._columns.set(new AuthorityManagementTable().DraftsAndLettersColumns);
  }
  
  ngOnDestroy(): void {
    // Cancel any pending data load operations
    if (this.loadDataAbortController) {
      this.loadDataAbortController.abort();
    }
  }
    
  async loadData(filter: any): Promise<void> {
    // Cancel any previous pending requests
    if (this.loadDataAbortController) {
      this.loadDataAbortController.abort();
    }
    
    // Create new abort controller for this request
    this.loadDataAbortController = new AbortController();
    const currentController = this.loadDataAbortController;
    
    this._loader.set(true);
    
    try {
      // Guard: Check if authority is set
      if (!this.currentAuthority()) {
        this._loader.set(false);
        return;
      }
      
      // Extract the actual filter values
      const filterData = filter?.value || filter;
      this._filter.set({ ...filterData });

      const searchText = this.authorityManagementSearchService.form.value.searchText;
      
      // Build the request filter with only the necessary fields
      const updatedFilter: DraftsAndLettersFilterOptions = {
        pageSize: 10,
        currentPage: filterData.currentPage || this.filter()?.currentPage || 1,
        authorityID: this.currentAuthority()!,
        isActive: this.includeInactive(),
        order: filterData.order || this.filter()?.order || 0,
      };
      
      // Use searchText from filterData if available, otherwise from form
      const finalSearchText = filterData.searchText || searchText;
      if (finalSearchText) {
        updatedFilter.searchText = finalSearchText;
      }
      
      if (filterData.orderByField || this.filter()?.orderByField) {
        updatedFilter.orderByField = filterData.orderByField || this.filter()?.orderByField;
      }
      
      const response = await this.authorityManagementService.getDraftsAndLetters(updatedFilter);

      // Check if this request was aborted
      if (currentController.signal.aborted) {
        return;
      }

      if (response?.list) {
        this._data.set(response.list);
        this._total.set(response.total);
        this._count.set(response.count);
      }
    } catch (error: any) {
      // Don't show error if request was aborted
      if (error?.name !== 'AbortError') {
        console.error('Error loading drafts and letters:', error);
        this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      }
    } finally {
      // Only set loader to false if this is still the current request
      if (!currentController.signal.aborted) {
        this._loader.set(false);
      }
    }
  }
  navigateToCreateDraft(): void {
    const baseRoute = RP.Management.Home;
    this.routerService.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.CreateDraft}`
    );
  }
  
  navigateToCreateLetter(): void {
    const baseRoute = RP.Management.Home;
    this.routerService.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.CreateLetter}`
    );
  }

  navigateToUpdateLetter(id: string, name: string): void {
    if (!id || !name) {
      console.error('Invalid letter id or name');
      return;
    }
    const baseRoute = RP.Management.Home;
    this.routerService.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.UpdateLetter}/${id}/${name}`
    );
  }

  navigateToUpdateDraft(id: string, name: string): void {
    if (!id || !name) {
      console.error('Invalid draft id or name');
      return;
    }
    const baseRoute = RP.Management.Home;
    this.routerService.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.UpdateDraft}/${id}/${name}`
    );
  }

  async exportDraftsAndLetters(): Promise<void> {
    if (!this.currentAuthority()) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      return;
    }
    
    try {
      const currentFilter = this.filter();
      const updatedFilter: DraftsAndLettersFilterOptions = {
        pageSize: 10,
        currentPage: currentFilter?.currentPage || 1,
        authorityID: this.currentAuthority()!,
        isActive: this.includeInactive(),
        order: currentFilter?.order || 0,
      };
      
      if (currentFilter?.searchText) {
        updatedFilter.searchText = currentFilter.searchText;
      }
      if (currentFilter?.orderByField) {
        updatedFilter.orderByField = currentFilter.orderByField;
      }
      
      const fileBlob = await this.authorityManagementService.exportDraftsAndLetters(updatedFilter);
      const fileName = `מכתבים וגלופות-${new Date().toISOString().slice(0, 10)}.xlsx`;
      const file = new File([fileBlob as BlobPart], fileName, {
        type: FileTypeExtension.XLSX,
      });
      Utils.saveFile(file);
    } catch (error) {
      console.error('Error exporting drafts and letters:', error);
      this.toaster.error(ErrorSuccessMessages.FAILED_EXPORT);
    }
  }

  async onCheckboxChange(event: boolean): Promise<void> {
    this._includeInactive.set(event);
    this._filter.update(filter => ({ ...filter!, isActive: event }));
    await this.loadData(this.filter());
  }

  async updateIsActive(): Promise<void> {
    try {
      const selected = this.selectedDraftAndLetter();
      if (!selected) {
        this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
        return;
      }
      
      const res = await this.authorityManagementService.updateIsActive(
        selected.gid,
        !selected.isActive
      );
      
      if (res) {
        this.toaster.success(ErrorSuccessMessages.LETTER_UPDATED_SUCCESSFULY);
        await this.loadData(this.filter());
      }
    } catch (error) {
      console.error('Error updating is active status:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  createModalButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeExportModal(),
        buttonClass: 'secondary-btn outline-btn', 
      },
      { label: 'ייצוא', action: () => this.exportDraftsAndLetters() },
    ];
  }

  closeExportModal(): void {
    this._isExportModalOpen.set(false);
  }

  openExportModal(): void {
    this._isExportModalOpen.set(true);
  }

  openIsActiveModal(): void {
    const selected = this.selectedDraftAndLetter();
    if (selected?.isActive) {
      this._isLetterSelectedIsActive.set(true);
    }
    this._isActiveModalOpen.set(true);
  }

  closeIsActiveModal(): void {
    this._isActiveModalOpen.set(false);
    this._isLetterSelectedIsActive.set(false);
  }

  onRowChange(e: DraftsAndLetters): void {
    if (this.selectedDraftAndLetter()?.gid === e.gid) {
      return;
    }
    this._selectedDraftAndLetter.set(e);
    this.selectedDraftAndLetterData$.next(e);
  }

  onRowClick(e: any): void {
    if (!e?.gid || !e?.name || !e?.typeId) {
      console.error('Invalid row data provided to onRowClick:', e);
      this.toaster.error('לא ניתן לפתוח את הפריט. נתונים לא תקינים.');
      return;
    }

    this._selectedDraftAndLetter.set(e);
    this.selectedDraftAndLetterData$.next(e);
    
    // Navigate based on type
    if (e.typeId === DraftsAndLettersTypes.Draft) {
      this.navigateToUpdateDraft(e.gid, e.name);
    } else if (e.typeId === DraftsAndLettersTypes.Letter) {
      this.navigateToUpdateLetter(e.gid, e.name);
    }
  }
}
