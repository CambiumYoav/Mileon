import { OnInit, Directive, ViewChild, signal, computed, effect, inject, ChangeDetectionStrategy, untracked } from '@angular/core';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { IdValue } from '../../../types/advanced-search/form-tab.model';
import { FieldDynamicComponent } from '../../shared/draft-and-letters-fields/field-dynamic/field-dynamic.component';
import { LookupNewService } from '../../../services/lookup-new.service';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { SelectParams } from '../../../types/advanced-search/select-option.model';
import { AuthorityService } from '../../../services/authority.service ';
import { ModalMessages } from '../../../constants/modalMessages';
import { RouterService } from '../../../services/router.service';

@Directive()
export abstract class BaseDraftLetterComponent implements OnInit {
  private readonly _rows = signal<DynamicRow[]>([]);
  private readonly _imagesOptions = signal<IdValue[]>([]);
  private readonly _textsOptions = signal<IdValue[]>([]);
  private readonly _isModalOpen = signal<boolean>(false);
  private readonly _isCopyModalOpen = signal<boolean>(false);
  private lastProcessedAuthorityId: string | null = null;

  readonly rows = computed(() => this._rows());
  readonly imagesOptions = computed(() => this._imagesOptions());
  readonly textsOptions = computed(() => this._textsOptions());
  readonly isModalOpen = computed(() => this._isModalOpen());
  readonly isCopyModalOpen = computed(() => this._isCopyModalOpen());

  readonly modalTitle = ModalMessages.UPDATE_DRAFTS_AND_LETTERS;
  readonly modalText = ModalMessages.ARE_YOU_SURE_GO_BACK;
  readonly modalCopyTitle = ModalMessages.COPY_DRAFTS_AND_LETTERS;

  @ViewChild('fieldDynamicRef') fieldDynamicRef!: FieldDynamicComponent;

  protected readonly lookupService = inject(LookupNewService);
  protected readonly authorityService = inject(AuthorityService);
  protected readonly router = inject(RouterService);

  // Move effect to field initializer to ensure it runs in injection context
  private readonly authorityEffect = effect(() => {
    const authorityID = this.authorityService.authorityId();
    
    // Guard: Only process if authority ID changed and is valid
    if (!authorityID || authorityID === this.lastProcessedAuthorityId) {
      return;
    }
    
    // Use untracked to prevent signal writes from re-triggering this effect
    untracked(() => {
      this.lastProcessedAuthorityId = authorityID;
      this._rows.set(this.getInitialRows());
      this.patchAuthorityId(authorityID);
      
      // Load templates asynchronously without blocking
      this.getImagesTemplates(authorityID).catch(err => {
        console.error('Error loading image templates:', err);
      });
      this.getTextTemplates(authorityID).catch(err => {
        console.error('Error loading text templates:', err);
      });
    });
  });

  ngOnInit(): void {
    // Effect is now handled by field initializer
  }

  protected abstract getInitialRows(): DynamicRow[];
  protected abstract getTemplatesValues(event: any): Promise<void>;
  protected abstract navigateToCopy(id: string, name: string): void;
  protected abstract onSubmit(event: any): void;
  protected abstract onPreview(event: any): void;

  private patchAuthorityId(authorityID: string) {
    const currentRows = this._rows();
    const updatedRows = currentRows.map(row => ({
      ...row,
      row: row.row.map(field => {
        if (field.name === 'authorityID') {
          return { ...field, value: authorityID };
        }
        return field;
      })
    }));
    this._rows.set(updatedRows);
  }

  protected async getTextTemplates(authorityID: string) {
    const filter: SelectParams = {
      authorityID: authorityID,
      currentPage: 1,
      pageSize: 10,
    };
    const res = await this.lookupService.getTextTemplates(filter);
    this._textsOptions.set(res?.list || []);
  }

  protected async getImagesTemplates(authorityID: string) {
    const filter: SelectParams = {
      authorityID: authorityID,
      currentPage: 1,
      pageSize: 10,
    };
    const res = await this.lookupService.getImagesTemplates(filter);
    this._imagesOptions.set(res?.list || []);
  }

  openGoBackModal() {
    this._isModalOpen.set(true);
  }
  
  closeGoBackModal() {
    this._isModalOpen.set(false);
  }
  
  openCopyModal() {
    this._isCopyModalOpen.set(true);
  }
  
  closeCopyModal() {
    this._isCopyModalOpen.set(false);
  }

  canNavigateAway() {
    const changed = this.fieldDynamicRef.isDirty();
    if (changed) {
      this.openGoBackModal();
      return;
    } else {
      this.navigateBack();
    }
  }

  navigateBack() {
    const baseRoute = RP.Management.Home;
    this.router.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}`
    );
  }

  protected groupTemplatesByRow(templates: any[]) {
    const sorted = [...templates].sort((a, b) => a.order - b.order);
    return sorted.reduce((acc, item) => {
      const rowKey = item.row;
      acc[rowKey] = acc[rowKey] || [];
      acc[rowKey].push(item);
      return acc;
    }, {} as Record<number, any[]>);
  }

  // Helper 2: Creating the HTML for a single item in a row
  protected createItemHtml(item: any, templateMap: Record<string, any>): string {
    let content = item.textAreaValue || templateMap[item.templateId] || '';

    // Handle base64 images
    if (typeof content === 'string' && content.startsWith('data:image/')) {
      content = `<img src="${content}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" alt="Image" />`;
    }

    const style = `
    flex: 1; 
    min-width: 0;
    box-sizing: border-box;
    text-align: right;
    direction: rtl;
    ${item.style || 'padding: 10px;'}
  `;

    return `<div style="${style}">${content}</div>`;
  }

  // Helper 3: Creating the HTML for an entire row
  protected createRowHtml(rowItems: any[], templateMap: Record<string, any>): string {
    const rowItemsHtml = rowItems
      .map((item) => this.createItemHtml(item, templateMap))
      .join('');

    return `
    <div style="margin-bottom: 30px; padding: 15px; border-radius: 5px;">
  
      <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        ${rowItemsHtml}
      </div>
    </div>
  `;
  }
}
