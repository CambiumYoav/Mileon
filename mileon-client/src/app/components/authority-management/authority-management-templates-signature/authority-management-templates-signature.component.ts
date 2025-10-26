import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthorityManagementTemplateBaseComponent } from '../authority-management-templates-base/authority-management-templates-base.component';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthorityService } from '../../../services/authority.service '; 
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { TemplatesTypesEnum } from '../../../types/enum/templatesTypesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { logoRequiredTemplates } from '../../../types/management/required-templates';
import { TemplatesForms } from '../../../types/management/templates-form';
import { Template } from '../../../types/templates/template.type';
import { AuthorityManagementSearchService } from '../authority-management-search/authority-management-search.service';
import { AuthorityManagementTemplatesFormComponent } from '../authority-management-templates-form/authority-management-templates-form.component';
import { AuthorityManagementService } from '../authority-management.service';
import { SessionService } from '../../../services/session.service';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { CommonModule } from '@angular/common';
import { AuthorityManagementSearchComponent } from '../authority-management-search/authority-management-search.component';
import { TemplatePreviewComponent } from "../../shared/template-preview/template-preview.component";

@Component({
  selector: 'app-authority-management-templates-signature',
  templateUrl: './authority-management-templates-signature.component.html',
  styleUrls: ['./authority-management-templates-signature.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AuthorityManagementSearchComponent,
    TemplatePreviewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements
})
export class AuthorityManagementTemplatesSignatureComponent extends AuthorityManagementTemplateBaseComponent {
  private readonly authorityManagementService = inject(AuthorityManagementService);
  private readonly searchService = inject(AuthorityManagementSearchService);

  templatesForm: FormGroup;
  templateTypeId = TemplatesTypesEnum.SIGNATURE;
  requiredTemplates = logoRequiredTemplates; //remove
  signatureSearch = SearchByTextEnum.LogosSearch;
  dialogComponent = AuthorityManagementTemplatesFormComponent;
  newTemplatePlaceholder: Template = {
    templateID: 'NEW',
    templateTitle: 'הוסף תבנית חדשה',
    templateBody: '',
  };
  total: number = 0;

  searchData: FilterOptions = { currentPage: 1, pageSize: 10 };

  constructor() {
    super();
    this.templatesForm = this.searchService.searchForm;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected override getFormDefinition(forms: TemplatesForms): DynamicRow[] {
    if (!this.isEditMode() || !this.isDialogEditSignal()) {
      return forms.CreateLogoOrSignatureTemplatesForm;
    } else {
      return forms.LogoOrSignatureTemplatesForm;
    }
  }
  public async getTemplatesFromServer(filter: any, append = false) {
    if (this.isLoading() || !this.currentAuthority()) return;

    this.setLoading(true);

    const newFilter = { ...filter, pageSize: 10, currentPage: this.pageNumber() };

    try {
      const res = await this.authorityManagementService.getTemplates(
        this.currentAuthority()!,
        this.templateTypeId,
        newFilter
      );

      if (res) {
        const serverTemplates = res.list;

        if (!this.isEditMode()) {
          const filtered = this.requiredTemplates.filter(
            (r) =>
              !serverTemplates.some(
                (s: Template) => s.templateTitle.trim() === r.templateTitle.trim()
              )
          );
          const newTemplates = append
            ? [...this.templates(), ...filtered, ...serverTemplates]
            : [...filtered, ...serverTemplates];
          this.setTemplates(newTemplates);
        } else {
          const newTemplates = append
            ? [...this.templates(), ...serverTemplates]
            : serverTemplates;
          this.setTemplates(newTemplates);
        }

        this.emitTemplatesValidity();
      }
    } finally {
      this.setLoading(false);
    }
  }

  protected async createTemplate(form: Template) {
    try {
      //save to session and trigger
      const template = { ...form, templateTypeId: this.templateTypeId };
      if (!this.isEditMode()) {
        this.sessionService.set('authorityTemplates', form);
      } else {
        const res = await this.authorityManagementService.createTemplate(
          this.currentAuthority()!,
          template
        );
        if (res) this.resetStateAfterUpdate();
      }
    } catch (error) {
      console.error('Error creating template:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  protected async editTemplate(form: Template) {
    try {
      const template = { ...form, templateTypeId: this.templateTypeId };
      const res = await this.authorityManagementService.updateTemplate(
        template
      );
      if (res) this.resetStateAfterUpdate();
    } catch (error) {
      console.error('Error creating template:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  private resetStateAfterUpdate() {
    this.toaster.success(
      this.isEditMode()
        ? ErrorSuccessMessages.TEMPLATE_EDITED_SUCCESSFULY
        : ErrorSuccessMessages.TEMPLATE_CREATED_SUCCESSFULY
    );
    this.setPageNumber(1);
    this.getTemplatesFromServer(this.templatesForm.value);
    this.emitTemplatesValidity();
    this.dialog.closeAll();
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;

    const threshold = 200;
    const isNearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < threshold;

    if (isNearBottom && this.hasMore() && !this.isLoading()) {
      this.setPageNumber(this.pageNumber() + 1);
      this.getTemplatesFromServer(this.templatesForm.value, true);
    }
  }
}
