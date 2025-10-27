import { Component, OnInit, OnDestroy, signal, computed, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthorityService } from '../../../services/authority.service ';
import { LookupNewService } from '../../../services/lookup-new.service';
import { DraftsAndLettersForms } from '../../../types/drafts-and-letters/draft-and-letters-forms';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { TemplatesTypesEnum } from '../../../types/enum/templatesTypesEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { RouterService } from '../../../services/router.service';
import { BaseDraftLetterComponent } from '../authority-management-base-darft-letter/authority-management-base-darft-letter.component';
import { AuthorityManagementService } from '../authority-management.service';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import { FieldDynamicComponent } from '../../shared/draft-and-letters-fields/field-dynamic/field-dynamic.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-authority-management-draft',
  templateUrl: './authority-management-draft.component.html',
  styleUrls: ['./authority-management-draft.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FieldDynamicComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
})
export class AuthorityManagementDraftComponent
  extends BaseDraftLetterComponent
  implements OnInit, OnDestroy
{
  private readonly _title = signal<string>(TitlesEnum.DraftsCreateTitle);
  private readonly _isEdit = signal<boolean>(false);
  private readonly _draftName = signal<string>('');
  private readonly _draftValue = signal<any>(null);
  private readonly _draftId = signal<string | null>(null);
  private readonly _draftData = signal<any>(null);
  private readonly _templateMap = signal<Record<string, any>>({});
  
  private routeSubscription?: Subscription;

  readonly title = computed(() => this._title());
  readonly isEdit = computed(() => this._isEdit());
  readonly draftName = computed(() => this._draftName());
  readonly draftValue = computed(() => this._draftValue());
  readonly draftId = computed(() => this._draftId());
  readonly draftData = computed(() => this._draftData());
  readonly templateMap = computed(() => this._templateMap());

  readonly templateTextTypeId = TemplatesTypesEnum.TEXT;

  private readonly route = inject(ActivatedRoute);
  private readonly authorityManagementService = inject(AuthorityManagementService);
  private readonly toaser = inject(ToastrService);

  constructor() {
    super();
  }
  
  override ngOnInit(): void {
    try {
      super.ngOnInit();
      
      this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
        const draftId = params.get('id');
        const name = params.get('name');
        
        // Validate ID is not a placeholder value
        if (draftId && (draftId === 'selected' || draftId === 'undefined' || draftId === 'null')) {
          console.error('Invalid draft ID:', draftId);
          this.toaser.error('מזהה גלופה לא תקין');
          this.navigateBack();
          return;
        }
        
        this._draftId.set(draftId);
        this._draftName.set(name || '');
        this._isEdit.set(!!draftId);

        if (this.isEdit()) {
          this._title.set(`${TitlesEnum.DraftsUpdateTitle} - ${name}`);
          this.getDraftById().catch(err => {
            console.error('Error in getDraftById:', err);
            this.toaser.error('שגיאה בטעינת הגלופה');
          });
        }
      });
    } catch (error) {
      console.error('Error in draft ngOnInit:', error);
      this.toaser.error('שגיאה באתחול הדף');
    }
  }
  
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  override getInitialRows(): DynamicRow[] {
    const form = new DraftsAndLettersForms();
    return form.DraftForm;
  }

  async getDraftById(): Promise<void> {
    try {
      if (!this.draftId()) {
        return;
      }
      
      const res = await this.authorityManagementService.getDraftAndLetterById(
        this.draftId()!
      );
      
      if (res) {
        this._draftData.set(res);
      }
    } catch (error) {
      console.error('Error fetching draft:', error);
      this.toaser.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  onSubmit(event: any): void {
    this._draftValue.set(event);
    this.createOrUpdateDraft();
  }

  async createOrUpdateDraft(): Promise<void> {
    try {
      const res = await this.authorityManagementService.createOrUpdateDraftAndLetter(
        this.draftValue()
      );
      
      if (res) {
        const message = this.isEdit()
          ? ErrorSuccessMessages.DRAFT_UPDATED_SUCCESSFULY
          : ErrorSuccessMessages.DRAFT_CREATED_SUCCESSFULY;
        this.toaser.success(message);
      }
    } catch (error) {
      console.error('Error creating/updating draft:', error);
      this.toaser.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async createCopy(): Promise<void> {
    try {
      if (!this.draftId()) {
        this.toaser.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
        return;
      }
      
      const res = await this.authorityManagementService.createCopy(
        this.draftId()!
      );
      
      if (res) {
        this.toaser.success(ErrorSuccessMessages.COPY_CREATED_SUCCESSFULY);
        this.navigateToCopy(res.gid, res.name);
      }
    } catch (error) {
      console.error('Error creating copy:', error);
      this.toaser.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }
  
  navigateToCopy(id: string, name: string) {
    const baseRoute = RP.Management.Home;
    this.router.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.UpdateDraft}/${id}/${name}`
    );
  } //make copy -> get res -> navigat by id + name

 generatePreviewAsPdf(templates: any) {
    const groupedByRow = this.groupTemplatesByRow(templates);
    const rowsHtml = Object.keys(groupedByRow)
      .sort((a, b) => Number(a) - Number(b))
      .map((rowKey) => {
        const rowItems = groupedByRow[Number(rowKey)];
        return this.createRowHtml(rowItems, this.templateMap());
      })
      .join('');

    const finalHtml = `
    <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px; background: #fff;">
      ${rowsHtml}
    </div>
  `;

    const previewContainer = document.createElement('div');
    previewContainer.innerHTML = finalHtml;
    this.convertHtml2pdf(previewContainer);
  }
  
  convertHtml2pdf(previewContainer: HTMLDivElement): void {
    html2pdf()
      .from(previewContainer)
      .set({
        margin: 10,
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      })
      .outputPdf('datauristring')
      .then((pdfDataUri: string) => {
        // Validate that the data URI is actually a PDF
        if (!pdfDataUri || !pdfDataUri.startsWith('data:application/pdf')) {
          throw new Error('Invalid PDF data');
        }
        
        const win = window.open('', '_blank');
        if (!win) {
          // Popup was blocked
          this.toaser.error('אנא אפשר/י חלונות קופצים כדי להציג את התצוגה המקדימה');
          return;
        }
        
        win.document.write(
          `<iframe width="100%" height="100%" src="${pdfDataUri}" style="border: none;"></iframe>`
        );
        win.document.close();
      })
      .catch((error: any) => {
        console.error('Error generating PDF:', error);
        this.toaser.error('שגיאה ביצירת קובץ PDF');
      });
  }

  submitFromParent() {
    this.fieldDynamicRef.triggerSubmit(); //  trigger form validation + emit values
  }

  getValuesToPreview() {
    this.fieldDynamicRef.triggerPreview();
  }
  
  override async getTemplatesValues(e: any): Promise<void> {
    try {
      if (!e?.templates || !Array.isArray(e.templates)) {
        return;
      }
      
      const ids = e.templates
        .map((template: any) => template.templateId)
        .filter((id: any) => id != null);

      if (ids.length === 0) {
        return;
      }

      const res = await this.authorityManagementService.getTemplatesValueByIds(ids);
      
      if (res && Array.isArray(res)) {
        const newTemplateMap = res.reduce((map: Record<string, any>, currentItem: any) => {
          map[currentItem.id] = currentItem.value;
          return map;
        }, {} as Record<string, any>);

        this._templateMap.set(newTemplateMap);
        this.generatePreviewAsPdf(e.templates);
      }
    } catch (error) {
      console.error('Error fetching template values:', error);
      this.toaser.error('שגיאה בטעינת התבניות');
    }
  }

  override onPreview(event: any): void {
    this.getTemplatesValues(event);
  }
}
