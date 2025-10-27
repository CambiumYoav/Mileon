import { Component, OnInit, OnDestroy, ViewChild, inject, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { DraftsAndLettersForms } from '../../../types/drafts-and-letters/draft-and-letters-forms';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { LookupNewService } from '../../../services/lookup-new.service';
import { TemplatesTypesEnum } from '../../../types/enum/templatesTypesEnum';
import { AuthorityService } from '../../../services/authority.service ';
import { AuthorityManagementService } from '../authority-management.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { RouterService } from '../../../services/router.service';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { BaseDraftLetterComponent } from '../authority-management-base-darft-letter/authority-management-base-darft-letter.component';
import { FieldDynamicComponent } from '../../shared/draft-and-letters-fields/field-dynamic/field-dynamic.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-authority-management-letter',
  templateUrl: './authority-management-letter.component.html',
  styleUrls: ['./authority-management-letter.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FieldDynamicComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
})

export class AuthorityManagementLetterComponent
  extends BaseDraftLetterComponent
  implements OnInit, OnDestroy
{
  private readonly _title = signal<string>(TitlesEnum.LetterCreateTitle);
  private readonly _isEdit = signal<boolean>(false);
  private readonly _letterName = signal<string>('');
  private readonly _letterValue = signal<any>(null);
  private readonly _letterId = signal<string | null>(null);
  private readonly _letterData = signal<any>(null);
  private readonly _templateMap = signal<Record<string, any>>({});
  
  private routeSubscription?: Subscription;

  readonly title = computed(() => this._title());
  readonly isEdit = computed(() => this._isEdit());
  readonly letterName = computed(() => this._letterName());
  readonly letterValue = computed(() => this._letterValue());
  readonly letterId = computed(() => this._letterId());
  readonly letterData = computed(() => this._letterData());
  readonly templateMap = computed(() => this._templateMap());

  readonly templateTextTypeId = TemplatesTypesEnum.TEXT;

  // ViewChild - inherited from base class

  private readonly route = inject(ActivatedRoute);
  private readonly authorityManagementService = inject(AuthorityManagementService);
  private readonly toaster = inject(ToastrService);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    try {
      super.ngOnInit();
      
      this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
        const letterId = params.get('id');
        const name = params.get('name');
        
        if (letterId && (letterId === 'selected' || letterId === 'undefined' || letterId === 'null')) {
          console.error('Invalid letter ID:', letterId);
          this.toaster.error('מזהה מכתב לא תקין');
          this.navigateBack();
          return;
        }
        
        this._letterId.set(letterId);
        this._letterName.set(name || '');
        this._isEdit.set(!!letterId);

        if (this.isEdit()) {
          this._title.set(`${TitlesEnum.LetterUpdateTitle} - ${name}`);
          this.getLetterById().catch(err => {
            console.error('Error in getLetterById:', err);
            this.toaster.error('שגיאה בטעינת המכתב');
          });
        }
      });
    } catch (error) {
      console.error('Error in letter ngOnInit:', error);
      this.toaster.error('שגיאה באתחול הדף');
    }
  }
  
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  override getInitialRows(): DynamicRow[] {
    const form = new DraftsAndLettersForms();
    return form.LetterForm;
  }

  async getLetterById(): Promise<void> {
    try {
      if (!this.letterId()) {
        return;
      }
      
      const res = await this.authorityManagementService.getDraftAndLetterById(
        this.letterId()!
      );
      
      if (res) {
        this._letterData.set(res);
      }
    } catch (error) {
      console.error('Error fetching letter:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  onSubmit(event: any): void {
    this._letterValue.set(event);
    this.createOrUpdateLetter();
  }

  async createOrUpdateLetter(): Promise<void> {
    try {
      const res = await this.authorityManagementService.createOrUpdateDraftAndLetter(
        this.letterValue()
      );
      
      if (res) {
        const message = this.isEdit()
          ? ErrorSuccessMessages.LETTER_UPDATED_SUCCESSFULY
          : ErrorSuccessMessages.LETTER_CREATED_SUCCESSFULY;
        this.toaster.success(message);
      }
    } catch (error) {
      console.error('Error creating/updating letter:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async createCopy(): Promise<void> {
    try {
      if (!this.letterId()) {
        this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
        return;
      }
      
      const res = await this.authorityManagementService.createCopy(
        this.letterId()!
      );
      
      if (res) {
        this.toaster.success(ErrorSuccessMessages.COPY_CREATED_SUCCESSFULY);
        this.navigateToCopy(res.gid, res.name);
      }
    } catch (error) {
      console.error('Error creating copy:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  navigateToCopy(id: string, name: string): void {
    const baseRoute = RP.Management.Home;
    this.router.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.UpdateLetter}/${id}/${name}`
    );
  }

  generatePreviewAsPdf(templates: any): void {
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
          this.toaster.error('אנא אפשר/י חלונות קופצים כדי להציג את התצוגה המקדימה');
          return;
        }
        
        win.document.write(
          `<iframe width="100%" height="100%" src="${pdfDataUri}" style="border: none;"></iframe>`
        );
        win.document.close();
      })
      .catch((error: any) => {
        console.error('Error generating PDF:', error);
        this.toaster.error('שגיאה ביצירת קובץ PDF');
      });
  }

  submitFromParent(): void {
    this.fieldDynamicRef.triggerSubmit();
  }

  getValuesToPreview(): void {
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
      this.toaster.error('שגיאה בטעינת התבניות');
    }
  }

  protected override onPreview(event: any): void {
    this.getTemplatesValues(event);
  }
}
