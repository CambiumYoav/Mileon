import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../constants/const_path';
import { AuthorityService } from '../../../services/authority.service ';
import { SessionService } from '../../../services/session.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import {
  DynamicField,
  DynamicRow,
  FieldOption,
} from '../../../types/infrastructure/InfrastructureTypes';
import { MsofonForms } from '../../../types/terminal/terminal-form';
import { TerminalService } from '../terminal.service';
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import {
  TerminalRequestsField,
  TerminalSettingsResponse,
} from '../../../types/terminal/terminalSettingsRequestType';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { AppModalComponent } from "../../shared/app-modal/app-modal.component";
import { SelectComponent } from '../../shared/base/select/select.component';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { TextareaCommentsComponent } from '../../shared/base/inputs/textarea-comments/textarea-comments.component';

@Component({
  selector: 'app-terminal-settings-legality',
  templateUrl: './terminal-settings-legality.component.html',
  styleUrls: ['./terminal-settings-legality.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ButtonComponent,
    AppModalComponent,
    SelectComponent,
    InputTextComponent,
    TextareaCommentsComponent
]
})
export class TerminalSettingsLegalityComponent {  
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private sessionService = inject(SessionService);
  private authorityService = inject(AuthorityService);
  private terminalService = inject(TerminalService);

  readonly Icons = ConstPath;
  readonly form = new MsofonForms().LegalitySettingsForm;
  readonly modalTitle = ModalMessages.UPDATE_SETTINGS;

  rows = signal<DynamicRow[]>(this.form);
  dynamicForm = signal<FormGroup>(this.fb.group({}));
  isSubmitted = signal<boolean>(false);
  currentActiveTabID = signal<string | null>(null);
  currentAuthority = signal<string | null>(null);
  settingsData = signal<TerminalSettingsResponse>([]);
  fields = signal<any[]>([]);
  isInitialSetup = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  modalButtons = signal<ModalButton[]>(this.createModalButtons());

  protected readonly formValue = computed(() => this.dynamicForm().value);
  protected readonly formValid = computed(() => this.dynamicForm().valid);

  constructor() {
    this.setupEffects();
    this.createForm();
  }

  private setupEffects() {
    effect(() => {
      const tabId = this.sessionService.getToken('currentActiveTabID');
      this.currentActiveTabID.set(tabId);

      const authorityId = this.authorityService.authorityId();
      this.currentAuthority.set(authorityId);

      if (tabId && authorityId) {
        this.getSettings();
      }
    });
  }

  async getSettings() {
    try {
      const tabId = this.currentActiveTabID();
      const authorityId = this.currentAuthority();
      
      if (tabId && authorityId) {
        const result = await this.terminalService.getSettingsByCategory(
          tabId,
          authorityId
        );

        if (!result.settings || result.settings.length === 0) {
          this.isInitialSetup.set(true);
          this.settingsData.set(this.mapDynamicRowsToSettings(this.rows()));
        } else {
          this.settingsData.set(result.settings);
          this.mergeServerDataIntoRows();
          this.createForm(); 
          this.patchFormWithServerData();
        }
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
      this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  private mapDynamicRowsToSettings(
    rows: DynamicRow[]
  ): TerminalRequestsField[] {
    const settings: TerminalRequestsField[] | any[] = [];

    for (const group of rows) {
      for (const field of group.row) {
        settings.push({
          id: '',
          name: field.name,
          type: field.type,
          value: field.value ?? '',
          isDisabled: field.disabled!,
        });
      }
    }
    return settings;
  }
  private mergeServerDataIntoRows(): void {
    const settings = this.settingsData();
    if (!settings?.length) return;

    const currentRows = this.rows();
    const updatedRows = currentRows.map(group => ({
      ...group,
      row: group.row.map(field => {
        const match = settings.find(s => s.name === field.name);
        if (match) {
          return {
            ...field,
            value: match.value,
            disabled: match.isDisabled
          };
        }
        return field;
      })
    }));

    this.rows.set(updatedRows);
  }

  private createForm(): void {
    const currentRows = this.rows();
    const formGroup = currentRows.reduce((group, dynamicRow) => {
      dynamicRow.row.forEach((field: DynamicField) => {
        group[field.name] = this.createFieldControl(field);
      });
      return group;
    }, {} as { [key: string]: any });
    
    this.dynamicForm.set(this.fb.group(formGroup));
    this.updateFormControlDisabledStates();
  }

  private updateFormControlDisabledStates(): void {
    const form = this.dynamicForm();
    const currentRows = this.rows();
    
    currentRows.forEach((dynamicRow) => {
      dynamicRow.row.forEach((field: DynamicField) => {
        const control = form.get(field.name);
        if (control) {
          const shouldBeDisabled = field.disabled ?? false;
          if (shouldBeDisabled && control.enabled) {
            control.disable();
          } else if (!shouldBeDisabled && control.disabled) {
            control.enable();
          }
        }
      });
    });
  }
  private patchFormWithServerData() {
    const form = this.dynamicForm();
    const settings = this.settingsData();
    
    if (!form || !settings?.length) return;

    this.fields.set(settings);
    
    const formPatches: { [key: string]: any } = {};
    
    for (const field of settings) {
      const controlKey = this.findControlNameByLabel(field.name);
      if (controlKey && form.get(controlKey)) {
        const formField = this.findFieldByName(controlKey);
        
        if (formField && formField.type === 'select') {
          if (formField.isMultiSelect) {
           
            const values = Array.isArray(field.value) ? field.value : [field.value];
            formPatches[controlKey] = values.map(val => {
              const option = formField.options?.find(opt => opt.value === val);
              return option ? option.value : val;
            }).filter(Boolean);
          } else {
           
            const option = formField.options?.find(opt => opt.value === field.value);
            formPatches[controlKey] = option ? option.value : field.value;
          }
        } else {
          formPatches[controlKey] = field.value;
        }
      }
    }
    
    form.patchValue(formPatches);
    this.dynamicForm.set(form);
    this.updateFormControlDisabledStates();
  }

  private findFieldByName(name: string): DynamicField | null {
    for (const row of this.rows()) {
      for (const field of row.row) {
        if (field.name === name) {
          return field;
        }
      }
    }
    return null;
  }

  private findControlNameByLabel(label: string): string | null {
    for (const group of this.form) {
      for (const field of group.row) {
        if (field.name.trim() === label.trim()) {
          return field.name;
        }
      }
    }
    return null;
  }

  private createFieldControl(field: any): any {
    const validations = this.getFieldValidations(field);
    const isDisabled = field.disabled ?? false;
    
    // For select fields, ensure the value matches the option format
    if (field.type === 'select' && field.value) {
      const selectedOption = field.options?.find((opt: FieldOption) => opt.value === field.value);
      const value = selectedOption ? selectedOption.value : field.value;
      return [{ value, disabled: isDisabled }, validations];
    }
    
    return [{ value: field.value ?? '', disabled: isDisabled }, validations];
  }

  /** Retrieves validations for a specific field */
  private getFieldValidations(field: any): ValidatorFn[] {
    const validations: ValidatorFn[] = [];
    const { validations: fieldValidations } = field;

    if (fieldValidations || field.isRequired) {
      // Handle isRequired at field level
      if (field.isRequired) {
        validations.push(Validators.required);
      }

      // Handle validations object if present
      if (fieldValidations) {
        if (fieldValidations.required) validations.push(Validators.required);
        if (fieldValidations.maxLength)
          validations.push(Validators.maxLength(fieldValidations.maxLength));
        if (fieldValidations.minLength)
          validations.push(Validators.minLength(fieldValidations.minLength));
        if (fieldValidations.pattern)
          validations.push(Validators.pattern(fieldValidations.pattern));
        if (fieldValidations.min !== undefined)
          validations.push(Validators.min(fieldValidations.min));
        if (fieldValidations.max !== undefined)
          validations.push(Validators.max(fieldValidations.max));
      }

      // Add select-specific validations
      if (field.type === 'select') {
        // For multi-select, validate array length if required
        if (field.isMultiSelect && field.isRequired) {
          validations.push((control) => {
            const value = control.value;
            if (!value || !Array.isArray(value) || value.length === 0) {
              return { required: true };
            }
            return null;
          });
        }
      }
    }

    return validations;
  }

  private buildSettingsPayload(
    rows: DynamicRow[],
    formValues: { [key: string]: any },
    serverSettings: any = []
  ): any[] {
    const payload: any[] = [];

    for (const group of rows) {
      for (const field of group.row) {
        const matchedServerSetting = serverSettings.find(
          (s: { name: string; }) => s.name === field.name
        );

        if (this.isInitialSetup()) {
          payload.push({
            displayName: field.label,
            settingName: field.name,
            type: field.type,
            value: formValues[field.name] ?? '',
          });
        } else {
          payload.push({
            id: matchedServerSetting?.id ?? '',
            displayName: field.label,
            settingName: field.name,
            type: field.type,
            value: formValues[field.name] ?? '',
          });
        }
      }
    }

    return payload;
  }

  async saveSettings() {
    const tabId = this.currentActiveTabID();
    const authorityId = this.currentAuthority();
    const form = this.dynamicForm();
    
    if (tabId && authorityId && form.valid) {
      try {
        const payload = this.buildSettingsPayload(
          this.rows(),
          form.value,
          this.settingsData()
        );

        const res = await this.terminalService.createOrUpdateSettings(
          payload,
          authorityId,
          tabId
        );

        if (res) {
          this.toastr.success(ErrorSuccessMessages.SETTINGS_UPDATED_SUCCESSFULY);
          this.closeModal();
          await this.getSettings(); // Refresh settings after save
        }
      } catch (error) {
        this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
        console.error('Error saving settings:', error);
      }
    }
  }

  private createModalButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeModal(),
        buttonClass: 'outline-secondary-btn',
      },
      {
        label: 'עדכן הגדרות',
        action: async () => await this.saveSettings(),
      },
    ];
  }

  getErrorMessage(fieldName: string): string {
    const control = this.dynamicForm().get(fieldName);
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'שדה חובה';
    }
    if (errors['minlength']) {
      return `מינימום ${errors['minlength'].requiredLength} תווים`;
    }
    if (errors['maxlength']) {
      return `מקסימום ${errors['maxlength'].requiredLength} תווים`;
    }
    if (errors['min']) {
      return `ערך מינימלי: ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `ערך מקסימלי: ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return 'פורמט לא תקין';
    }
    
    return 'ערך לא תקין';
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
