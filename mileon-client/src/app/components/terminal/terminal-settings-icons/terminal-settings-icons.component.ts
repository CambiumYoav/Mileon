import { Component, computed, effect, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../constants/const_path';   
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import { AuthorityService } from '../../../services/authority.service ';
import { SessionService } from '../../../services/session.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { SubTable, SubTableField } from '../../../types/subTableField';
import { TerminalIconsSettingsResponse } from '../../../types/terminal/terminalSettingsRequestType';
import { TerminalService } from '../terminal.service';
import { TerminalSettingsFields } from '../../../types/terminal/terminal-settings.fields';
import { SubTableComponent } from "../../shared/sub-table/sub-table.component";
import { AppModalComponent } from "../../shared/app-modal/app-modal.component";
import { TerminalSettingRequest } from '../../../types/terminal/terminalSettingsRequestType';

interface IconsSettingsResponse {
  settings: TerminalSettingRequest[];
}

@Component({
  selector: 'app-terminal-settings-icons',
  templateUrl: './terminal-settings-icons.component.html',
  styleUrls: ['./terminal-settings-icons.component.scss'],
  imports: [SubTableComponent, AppModalComponent],
})
export class TerminalSettingsIconsComponent {
  private readonly sessionService = inject(SessionService);
  private readonly authorityService = inject(AuthorityService);
  private readonly terminalService = inject(TerminalService);
  private readonly toastr = inject(ToastrService);

  readonly Icons = ConstPath;
  readonly modalTitle = ModalMessages.UPDATE_SETTINGS;

  // Signals
  readonly subTablesData = signal<SubTable[]>([]);
  readonly currentActiveTabID = signal<string | null>(null);
  readonly currentAuthority = signal<string | null>(null);
  readonly settingsData = signal<TerminalSettingRequest[]>([]);
  readonly editedSettings = signal<TerminalSettingRequest[]>([]);
  readonly isInitialSetup = signal<boolean>(false);
  readonly isModalOpen = signal<boolean>(false);
  readonly modalButtons = signal<ModalButton[]>(this.createModalButtons());

  constructor() {
    // Initialize currentActiveTabID
    this.currentActiveTabID.set(
      this.sessionService.getToken('currentActiveTabID')
    );

    // Setup effect to watch authorityID changes
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      this.currentAuthority.set(authorityID);
      if (authorityID) {
        this.getSettings();
      }
    });
  }

  private async getSettings() {
    try {
      const newSettings = new TerminalSettingsFields();
      const defaultSettings = newSettings.IconAssignmentsSettings;

      this.settingsData.set([...defaultSettings]);

      if (this.currentActiveTabID() && this.currentAuthority()) {
        const result: IconsSettingsResponse = await this.terminalService.getIconsSettings(
          this.currentAuthority()!
        );
        if (!result.settings || result.settings.length === 0) {
          this.isInitialSetup.set(true); // No settings exist yet
          this.settingsData.set(defaultSettings);
        }

        const serverSettings: TerminalSettingRequest[] = result?.settings ?? [];
        // Merge server values into default structure by `settingName`
        const updatedSettings = defaultSettings.map((setting) => {
          const serverMatch = serverSettings.find(
            (s: TerminalSettingRequest) => s.settingName?.trim() === setting.settingName?.trim()
          );

          return {
            ...(serverMatch || {}),
            ...setting,
            id: serverMatch?.id,
            value: serverMatch?.value ?? setting.value,
            isDisabled: serverMatch?.isDisabled ?? true,
          };
        });

        this.settingsData.set(updatedSettings);
        this.subTablesData.set(this.buildSubTables(updatedSettings));
      }
    } catch (e) {
      console.error(e);
      this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }
  buildSubTables(settings: TerminalSettingRequest[]): SubTable[] {
    const parkingSettings: SubTableField[] = [];
    const nonParkingSettings: SubTableField[] = [];

    for (const field of settings) {
      const mapped = this.mapField(field);
      if (field.isParking) {
        parkingSettings.push(mapped);
      } else {
        nonParkingSettings.push(mapped);
      }
    }

    const result: SubTable[] = [];

    if (nonParkingSettings.length) {
      result.push({
        key: 'nonParking',
        category: 'סוג עבירה',
        fields: nonParkingSettings,
        extraColName: 'אייקון מקושר',
        tableTitle: 'כללי / מנהלי',
      });
    }
    if (parkingSettings.length) {
      result.push({
        key: 'parking',
        category: 'קוד סעיף עבירה',
        fields: parkingSettings,
        extraColName: 'אייקון מקושר',
        tableTitle: 'חניה',
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
      isParking: field.isParking,
      isDisabled: field.isDisabled,
    };
  }

  // Computed signal for payload
  private readonly settingsPayload = computed(() => {
    return this.isInitialSetup()
      ? this.settingsData() // send all fields (initial creation)
      : this.editedSettings(); // send only changes
  });

  // Handle field updates
  onFieldUpdate(event: { key: string; value: any }) {
    const currentSettings = this.settingsData();
    const fieldIndex = currentSettings.findIndex((f) => f.id === event.key);

    if (fieldIndex === -1) return;

    const updatedSettings = [...currentSettings];
    updatedSettings[fieldIndex] = {
      ...updatedSettings[fieldIndex],
      value: event.value
    };
    this.settingsData.set(updatedSettings);

    const currentEditedSettings = this.editedSettings();
    const editedIndex = currentEditedSettings.findIndex(
      (f) => f.id === event.key
    );

    if (editedIndex !== -1) {
      const updatedEditedSettings = [...currentEditedSettings];
      updatedEditedSettings[editedIndex] = {
        ...updatedEditedSettings[editedIndex],
        value: event.value
      };
      this.editedSettings.set(updatedEditedSettings);
    } else {
      this.editedSettings.set([
        ...currentEditedSettings,
        { ...updatedSettings[fieldIndex] }
      ]);
    }
  }

  async saveSettings() {
    const currentTabId = this.currentActiveTabID();
    const currentAuthority = this.currentAuthority();
    
    if (currentTabId && currentAuthority) {
      try {
        const res = await this.terminalService.createOrUpdateIconsSettings(
          this.settingsPayload(),
          currentAuthority,
          currentTabId
        );

        if (res) {
          this.toastr.success(
            ErrorSuccessMessages.SETTINGS_UPDATED_SUCCESSFULY
          );
          this.closeModal();
        }
      } catch (error) {
        this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
        console.error(error);
      }
    }
  }

  private createModalButtons(): ModalButton[] {
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
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
