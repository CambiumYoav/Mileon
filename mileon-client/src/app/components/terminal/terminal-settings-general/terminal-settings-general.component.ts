import { Component, OnInit, effect } from '@angular/core';
import { AuthorityService } from '../../../services/authority.service ';
import { SessionService } from '../../../services/session.service';
import { TicketTypeDisplayEnum } from '../../../types/enum/ticketEnums';
import { Utils } from '../../../utils/utils';
import { TerminalService } from '../terminal.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { ModalButton } from '../../../constants/modalButtons';
import { ConstPath } from '../../../constants/const_path';
import { ModalMessages } from '../../../constants/modalMessages';
import { TerminalSettingsResponse } from '../../../types/terminal/terminalSettingsRequestType';
import {
  mapTerminalSettingsToDynamicFields,
  TerminalSettingsFields,
} from '../../../types/terminal/terminal-settings.fields';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DynamicField } from '../../../types/infrastructure/InfrastructureTypes';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TerminalSettingsColumnComponent } from '../terminal-settings-column/terminal-settings-column.component';
import { AppModalComponent } from "../../shared/app-modal/app-modal.component";
import { ButtonComponent } from "../../shared/base/button/button.component";

@Component({
  selector: 'app-terminal-settings-general',
  templateUrl: './terminal-settings-general.component.html',
  styleUrls: ['./terminal-settings-general.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TerminalSettingsColumnComponent, AppModalComponent, ButtonComponent],
})
export class TerminalSettingsGeneralComponent implements OnInit {
  objectKeys = Object.keys;
  Icons = ConstPath;
  labelColumn: string[] = [];
  columnCount: number = 3;
  currentActiveTabID!: string | null;
  currentAuthority!: string | null;
  settingsData: any = [];
  editedSettings: TerminalSettingsResponse = [];
  form!: FormGroup;
  dynamicFields: DynamicField[] | any[] = [];
  isInitialSetup: boolean = false;
  
  isModalOpen: boolean = false;
  modalButtons: ModalButton[] = this.createModalButtons();
  modalTitle = ModalMessages.UPDATE_SETTINGS;
  constructor(
    private sessionService: SessionService,
    private authorityService: AuthorityService,
    private toastr: ToastrService,
    private terminalService: TerminalService,
    private fb: FormBuilder
  ) {
    // React to authority changes via signals (runs in injection context)
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      if (authorityID) {
        this.currentAuthority = authorityID;
        if (this.currentActiveTabID) {
          this.getSettings();
        }
      }
    });
  }

  ngOnInit(): void {
    this.currentActiveTabID =
      this.sessionService.getToken('currentActiveTabID');
    // Initial load once both tab and authority are resolved
    this.getSettings();
  }
  requiredSelectValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === null ||
      control.value === '' ||
      control.value === '0'
      ? { required: true }
      : null;
  }

  requiredRadioValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === null || control.value === ''
      ? { required: true }
      : null;
  }

  async getSettings() {
    try {
      const newSettings = new TerminalSettingsFields();
      const defaultSettings = newSettings.GeneralSettings;

      this.settingsData = [...defaultSettings];

      if (this.currentActiveTabID && this.currentAuthority) {
        const result = await this.terminalService.getSettingsByCategory(
          this.currentActiveTabID,
          this.currentAuthority
        );
        if (!result.settings || result.settings.length === 0) {
          this.isInitialSetup = true; // No settings exist yet
          this.settingsData = defaultSettings;
        }

        const serverSettings = result?.settings ?? [];

        // Merge server values into default structure by `settingName`
        this.settingsData = defaultSettings.map((setting: any) => {
          const serverMatch = serverSettings.find(
            (s: any) => s.name === setting.settingName
          );
          return {
            ...setting,
            ...(serverMatch
              ? {
                  id: serverMatch.id,
                  value: serverMatch.value,
                  isDisabled: serverMatch.isDisabled ?? true,
                  settingName: serverMatch.name,
                }
              : {}),
          };
        });
        this.dynamicFields = mapTerminalSettingsToDynamicFields(
          this.settingsData
        );

        this.form = this.fb.group(
          Object.fromEntries(
            this.dynamicFields.map((field: any) => {
              let validators: ValidatorFn[] = [];

              if (field.isRequired) {
                if (field.type === 'select') {
                  validators.push(this.requiredSelectValidator);
                } else if (field.type === 'radio') {
                  validators.push(this.requiredRadioValidator);
                } else {
                  validators.push(Validators.required);
                }
              }

              return [
                field.name as string,
                this.fb.control(
                  { value: field.value ?? '', disabled: field.disabled },
                  validators
                ),
              ];
            })
          )
        );

        this.buildLabelColumn(this.settingsData);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Titles for each ticket type
  columnTitles: { [key: string]: string } = Object.fromEntries(
    Object.entries(TicketTypeDisplayEnum)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => [value, key]) // Map numeric values to their Hebrew names
  );

  // Map key to a column title
  getColumnTitle(key: string): string {
    return Utils.columnTitles[key];
  }

  buildLabelColumn(settings: TerminalSettingsResponse | any): void {
    // Extract labels from the first object in settingsData
    this.columnCount = 1;
    if (settings) {
      this.labelColumn = settings.map((field: any) => field.displayName);
    }
  }

  onFieldUpdate(event: { key: string; value: any }) {
    let updatedField = this.settingsData.find((f: any) => f.id === event.key);
    // Fallback: try to find by settingName if no match by name
    if (!updatedField) {
      updatedField = this.settingsData.find((f: any) => f.settingName === event.key);
    }

    if (updatedField) {
      updatedField.value = event.value;

      const alreadyExists = this.editedSettings.find(
        (f: any) => f.name === updatedField.settingName
      );
      if (!alreadyExists) {
        this.editedSettings.push(updatedField);
      }
    }
  }

  async saveSettings() {
    if (this.currentActiveTabID && this.currentAuthority) {
      try {
        const payload = this.isInitialSetup
          ? this.settingsData // send all fields (initial creation)
          : this.editedSettings; // send only changes

        const res = await this.terminalService.createOrUpdateSettings(
          payload,
          this.currentAuthority,
          this.currentActiveTabID
        );

        if (res) {
          this.toastr.success(
            ErrorSuccessMessages.SETTINGS_UPDATED_SUCCESSFULY
          );
        }
      } catch (error) {
        this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
        console.log(error);
      }
    }
  }
  //Modal
  createModalButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeModal(),
        buttonClass: 'pop-up-cancel-btn-fill',
      },
      {
        label: 'עדכן הגדרות',
        action: async () => await this.saveSettings(),
      },
    ];
  }

  openModal() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('יש למלא את כל השדות החובה לפני שמירה');
      return;
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
