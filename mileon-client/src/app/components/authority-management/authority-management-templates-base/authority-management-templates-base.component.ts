import { Directive, OnInit, computed, inject, signal, effect, runInInjectionContext, Injector } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthorityService } from '../../../services/authority.service ';  
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { SessionService } from '../../../services/session.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { TemplatesForms } from '../../../types/management/templates-form';
import { Template } from '../../../types/templates/template.type';

interface DialogResult {
  isEdit: boolean;
  isDelete: boolean;
  form: Template;
}

@Directive() // use @Directive to allow extension without rendering
export abstract class AuthorityManagementTemplateBaseComponent implements OnInit {
  protected readonly dialog = inject(MatDialog);
  protected readonly toaster = inject(ToastrService);
  protected readonly sharedDataService = inject(SharedDataService);
  protected readonly modeDetectionService = inject(ModeDetectionService);
  private readonly authorityService = inject(AuthorityService);
  protected readonly sessionService = inject(SessionService);
  private readonly injector = inject(Injector);

  private readonly authorityIDSignal = toSignal(this.authorityService.authorityId$, { initialValue: null });

  private readonly templatesSignal = signal<Template[]>([]);
  private readonly selectedTemplateSignal = signal<Template | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly hasMoreSignal = signal<boolean>(true);
  private readonly pageNumberSignal = signal<number>(1);
  protected readonly isDialogEditSignal = signal<boolean>(false);

  readonly currentAuthority = computed(() => this.authorityIDSignal());
  readonly templates = computed(() => this.templatesSignal());
  readonly selectedTemplate = computed(() => this.selectedTemplateSignal());
  readonly isLoading = computed(() => this.isLoadingSignal());
  readonly hasMore = computed(() => this.hasMoreSignal());
  readonly pageNumber = computed(() => this.pageNumberSignal());
  readonly isEditMode = computed(() => this.modeDetectionService.getCurrentMode());

  abstract templatesForm: FormGroup;
  abstract templateTypeId: number;
  abstract requiredTemplates: Template[];
  
  dialogData: DynamicRow[] = [];

  // Move effect to field initializer to ensure it runs in injection context
  private readonly authorityEffect = effect(() => {
    const authority = this.currentAuthority();
    if (authority) {
      this.fetchTemplates();
    }
  });

  ngOnInit(): void {
    const form = new TemplatesForms();
    this.dialogData = this.getFormDefinition(form);
  }

  protected fetchTemplates(): void {
    if (!this.isEditMode()) {
      this.templatesSignal.set([...this.requiredTemplates]);
      this.emitTemplatesValidity();
    } else {
      this.getTemplatesFromServer(this.templatesForm.value);
    }
  }

  protected abstract getTemplatesFromServer(
    filter: any,
    append?: boolean
  ): void;
  protected abstract getFormDefinition(form: TemplatesForms): DynamicRow[];

  protected emitTemplatesValidity(): void {
    const allValid = this.templates().every(
      (t) => !t.isRequired || (t.templateBody && t.templateBody.trim() !== '')
    );
    this.sharedDataService.setValidTemplate({
      key: 'isTemplatesValid',
      value: allValid,
    });
  }

  protected generateDialogDataFromTemplate(
    template: any,
    baseDialogData: DynamicRow[]
  ): DynamicRow[] {
    return baseDialogData.map((section) => ({
      ...section,
      row: section.row.map((field) =>
        template[field.name] !== undefined
          ? { ...field, value: template[field.name] }
          : field
      ),
    }));
  }

  onAddNewTemplate(): void {
    this.selectedTemplateSignal.set(null);
    this.openDialog(false);
  }

  onEditTemplate(template: Template): void {
    // console.log('Editing template:', template);
    this.selectedTemplateSignal.set(template);
    this.openDialog(true);
  }

  protected openDialog(isEdit: boolean): void {
    this.isDialogEditSignal.set(isEdit);
    const form = new TemplatesForms();
    let dialogData =
      isEdit && this.selectedTemplate()
        ? this.generateDialogDataFromTemplate(
            this.selectedTemplate()!,
            this.getFormDefinition(form)
          )
        : this.getFormDefinition(form);

    const dialogRef = this.dialog.open(
      // Must be provided by child
      (this as any).dialogComponent,
      {
        autoFocus: false,
        hasBackdrop: true,
        data: {
          form: dialogData,
          isEdit,
          title: isEdit ? 'עריכת תבנית' : 'תבנית חדשה',
          isRequired: this.selectedTemplate()?.isRequired,
          template: this.selectedTemplate(),
        },
      }
    );

    // Use effect to handle dialog result within injection context
    runInInjectionContext(this.injector, () => {
      // Convert subscription to signal-based approach
      const dialogDataSignal = toSignal((dialogRef.componentInstance as any).dataSubject, { 
        initialValue: null as DialogResult | null 
      });
      
      effect(() => {
        const result = dialogDataSignal() as DialogResult | null;
        if (result) {
          const isEditingExisting =
            result.isEdit &&
            this.selectedTemplate() &&
            this.selectedTemplate()!.templateID &&
            this.selectedTemplate()!.templateID !== '';

          if (result.isDelete) {
            this.editTemplate({ ...result.form, isActive: false });
          } else if (isEditingExisting) {
            const fullTemplate: Template = {
              ...this.selectedTemplate()!, //include־templateID
              ...result.form,
            };
            this.editTemplate(fullTemplate);
            // this.editTemplate(result.form);
          } else {
            // this.addOrUpdateTemplateInSession(result.form);
            this.createTemplate(result.form);
          }
        }
      });
    });
  }
  addOrUpdateTemplateInSession(template: any) {
    const templates: any[] =
      this.sessionService.get('authorityTemplates') || [];

    const index = templates.findIndex(
      (t) => t.templateId === template.templateId
    );
    if (index !== -1) {
      templates[index] = template; // Update
    } else {
      templates.push(template); // Add
    }

    this.sessionService.set('authorityTemplates', templates);
  }

  protected abstract createTemplate(form: Template): void;
  protected abstract editTemplate(form: Template): void;

  protected updateTemplateIdByTitle(newTemplate: Template): void {
    const currentTemplates = this.templatesSignal();
    const index = currentTemplates.findIndex((t) => t.name === newTemplate.name);

    if (index !== -1) {
      const updatedTemplates = [...currentTemplates];
      updatedTemplates[index].templateID = newTemplate.templateID;
      this.templatesSignal.set(updatedTemplates);
    } else {
      this.templatesSignal.set([newTemplate, ...currentTemplates]);
    }
  }

  // Helper methods for child classes to update signals
  protected setTemplates(templates: Template[]): void {
    this.templatesSignal.set(templates);
  }

  protected setLoading(loading: boolean): void {
    this.isLoadingSignal.set(loading);
  }

  protected setHasMore(hasMore: boolean): void {
    this.hasMoreSignal.set(hasMore);
  }

  protected setPageNumber(pageNumber: number): void {
    this.pageNumberSignal.set(pageNumber);
  }
}
