import { Component, inject, signal, computed, effect } from '@angular/core';
import { AuthorityService } from '../../../services/authority.service ';   
import { SessionService } from '../../../services/session.service';
import { TerminalService } from '../terminal.service';
import { SubTable, SubTableField } from '../../../types/subTableField';
import { TerminalSettingsFieldsEnum } from '../../../types/enum/terminalSettingsEnum';
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { ConstPath } from '../../../constants/const_path';
import { TerminalRequestsField, TerminalSettingRequest, TerminalSettingsResponse } from '../../../types/terminal/terminalSettingsRequestType';
import { TerminalSettingsFields } from '../../../types/terminal/terminal-settings.fields';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { AppModalComponent } from "../../shared/app-modal/app-modal.component";
import { SubTableComponent } from "../../shared/sub-table/sub-table.component";

@Component({
  selector: 'app-terminal-settings-external',
  templateUrl: './terminal-settings-external.component.html',
  styleUrls: ['./terminal-settings-external.component.scss'],
  imports: [ButtonComponent, AppModalComponent, SubTableComponent],
})
export class TerminalSettingsExternalComponent {
  private sessionService = inject(SessionService);
  private authorityService = inject(AuthorityService);
  private terminalService = inject(TerminalService);
  private toastr = inject(ToastrService);

  readonly objectKeys = Object.keys;
  readonly Icons = ConstPath;
  readonly priorityOrder = [
    TerminalSettingsFieldsEnum.PangoUsername,
    TerminalSettingsFieldsEnum.PangoPassword,
    TerminalSettingsFieldsEnum.CelloparkUsername,
    TerminalSettingsFieldsEnum.CelloparkPassword,
  ];
  readonly modalTitle = ModalMessages.UPDATE_SETTINGS;

  private _subTablesData = signal<SubTable[]>([]);
  private _currentActiveTabID = signal<string | null>(null);
  private _currentAuthority = signal<string | null>(null);
  private _settingsData = signal<TerminalSettingRequest[]>([]);
  private _editedSettings = signal<TerminalSettingRequest[]>([]);
  private _isInitialSetup = signal<boolean>(false);
  private _isModalOpen = signal<boolean>(false);
  private _modalButtons = signal<ModalButton[]>(this.createModalButtons());

  subTablesData = this._subTablesData.asReadonly();
  currentActiveTabID = this._currentActiveTabID.asReadonly();
  currentAuthority = this._currentAuthority.asReadonly();
  settingsData = this._settingsData.asReadonly();
  editedSettings = this._editedSettings.asReadonly();
  isInitialSetup = this._isInitialSetup.asReadonly();
  isModalOpen = this._isModalOpen.asReadonly();
  modalButtons = this._modalButtons.asReadonly();

  constructor() {
    this._currentActiveTabID.set(this.sessionService.getToken('currentActiveTabID'));

    effect(() => {
      const authorityID = this.authorityService.authorityId();
      this._currentAuthority.set(authorityID);
      if (authorityID) {
        this.getSettings();
      }
    });
  }

  async getSettings() {
    try {
      const newSettings = new TerminalSettingsFields();
      const defaultSettings = newSettings.ExternalSettings;

      this._settingsData.set([...defaultSettings]);

      const activeTabID = this._currentActiveTabID();
      const authority = this._currentAuthority();

      if (activeTabID && authority) {
        const result = await this.terminalService.getSettingsByCategory(
          activeTabID,
          authority
        );
        
        if (!result.settings || result.settings.length === 0) {
          this._isInitialSetup.set(true); // No settings exist yet
          this._settingsData.set(defaultSettings);
        }

        const serverSettings = result?.settings ?? [];

        // Merge server values into default structure by `settingName`
        const mergedSettings = defaultSettings.map((setting) => {
          const serverMatch = serverSettings.find(
            (s: { name: string; }) => s.name?.trim() === setting.settingName?.trim()
          );

          return {
            ...(serverMatch || {}),
            ...setting,
            id: serverMatch?.id,
            value: serverMatch?.value ?? setting.value,
            isDisabled: serverMatch?.isDisabled,
          };
        });

        this._settingsData.set(mergedSettings);
        this._subTablesData.set(this.buildSubTables(mergedSettings));
      }
    } catch (e) {
      console.error(e);
    }
  }

  buildSubTables(settings: TerminalSettingsResponse | any) {
    const refundInterfaceFields: SubTableField[] = [];
    const solarParkingFields: SubTableField[] = [];
    const solarParkingSuspicionFields: SubTableField[] = [];

    for (const field of settings) {
      if (
        field.displayName &&
        field.displayName.includes(
          TerminalSettingsFieldsEnum.RefundInterfaceStatus
        )
      ) {
        refundInterfaceFields.push(this.mapField(field));
      } else if (
        (field.displayName &&
          field.displayName.includes(
            TerminalSettingsFieldsEnum.PangoUsername
          )) ||
        field.displayName.includes(TerminalSettingsFieldsEnum.PangoPassword) ||
        field.displayName.includes(
          TerminalSettingsFieldsEnum.CelloparkUsername
        ) ||
        (field.displayName &&
          field.displayName.includes(
            TerminalSettingsFieldsEnum.CelloparkPassword
          ))
      ) {
        solarParkingFields.push(this.mapField(field));
      } else if (
        (field.displayName &&
          field.displayName.includes(
            TerminalSettingsFieldsEnum.PangoInquiry
          )) ||
        field.displayName.includes(TerminalSettingsFieldsEnum.CelloparkInquiry)
      ) {
        solarParkingSuspicionFields.push(this.mapField(field));
      }
    }

    const result: SubTable[] = [];

    if (refundInterfaceFields.length) {
      result.push({
        key: 'refundInterface',
        category: TerminalSettingsFieldsEnum.RefundInterface,
        fields: refundInterfaceFields,
      });
    }

    if (solarParkingFields.length) {
      solarParkingFields.sort((a, b) => {
        const aPriority = this.priorityOrder.findIndex((displayName) =>
          a.label.includes(displayName)
        );
        const bPriority = this.priorityOrder.findIndex((dispalyName) =>
          b.label.includes(dispalyName)
        );

        if (aPriority === -1) return 1;
        if (bPriority === -1) return -1;

        return aPriority - bPriority;
      });

      result.push({
        key: 'solarParking',
        category: TerminalSettingsFieldsEnum.SolarParking,
        fields: solarParkingFields,
      });
    }

    if (solarParkingSuspicionFields.length) {
      result.push({
        key: 'solarParkingSuspicion',
        category: TerminalSettingsFieldsEnum.SolarParkingSuspicion,
        fields: solarParkingSuspicionFields,
      });
    }

    return result;
  }

  mapField(field: any) {
    return {
      label: field.displayName,
      key: field.id,
      type: field.type,
      value: field.value,
      options:
        field.type === 'radio'
          ? [
              { label: 'פעיל', value: '1' },
              { label: 'לא פעיל', value: '0' },
            ]
          : undefined,
      isDisabled: field.isDisabled,
    };
  }

  // Handle field updates
  onFieldUpdate(event: { key: string; value: any }) {
    const currentSettings = this._settingsData();
    const fieldIndex = currentSettings.findIndex((f) => f.id === event.key);

    if (fieldIndex === -1) return;

    // Create new array with updated value
    const updatedSettings = [...currentSettings];
    updatedSettings[fieldIndex] = {
      ...updatedSettings[fieldIndex],
      value: event.value
    };
    this._settingsData.set(updatedSettings);

    // Update edited settings
    const currentEditedSettings = this._editedSettings();
    const editedIndex = currentEditedSettings.findIndex(
      (f) => f.id === event.key
    );

    if (editedIndex !== -1) {
      const updatedEditedSettings = [...currentEditedSettings];
      updatedEditedSettings[editedIndex] = {
        ...updatedEditedSettings[editedIndex],
        value: event.value
      };
      this._editedSettings.set(updatedEditedSettings);
    } else {
      this._editedSettings.set([
        ...currentEditedSettings,
        { ...updatedSettings[fieldIndex] }
      ]);
    }
  }

  async saveSettings() {
    const activeTabID = this._currentActiveTabID();
    const authority = this._currentAuthority();

    if (activeTabID && authority) {
      try {
        // Map TerminalSettingRequest to TerminalRequestsField
        const mapToRequestsField = (setting: TerminalSettingRequest): TerminalRequestsField => ({
          name: setting.settingName,
          id: setting.id || '',
          isDisabled: setting.isDisabled || false,
          value: setting.value,
          type: setting.type
        });

        const settings = this._isInitialSetup()
          ? this._settingsData() // send all fields (initial creation)
          : this._editedSettings(); // send only changes

        const payload = settings.map(mapToRequestsField);
        
        const res = await this.terminalService.createOrUpdateSettings(
          payload,
          authority,
          activeTabID
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
        buttonClass: 'outline-secondary-btn',
      },
      {
        label: 'עדכן הגדרות',
        action: async () => await this.saveSettings(),
      },
    ];
  }

  openModal() {
    this._isModalOpen.set(true);
  }

  closeModal() {
    this._isModalOpen.set(false);
  }
}
