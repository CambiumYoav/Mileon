import { Component, EventEmitter, Input, OnInit, Output, signal, computed, effect } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Field,
  FieldTypeEnum,
} from '../../../../../types/advanced-search/form-tab.model'; 
import { FileType } from '../../../../../types/enum/fileType.enum';
import { IdValuePair } from '../../../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../../../types/uploadedFile';
import { userLocalFields } from '../../../../../types/users/user-form-fields';
import { UsersService } from '../../users.service';
import { Utils } from '../../../../../utils/utils';
import { CheckboxOption, InputCheckboxOptionGroupComponent } from '../../../../../components/shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { ToastrService } from 'ngx-toastr';
import { RouterService } from '../../../../../services/router.service';
import { ErrorSuccessMessages } from '../../../../../types/enum/error-success-messages';
import { SessionService } from '../../../../../services/session.service';
import { ConstPath } from '../../../../../constants/const_path';
import { PermissionService } from '../../../../../services/permission.service';
import { InputTextComponent } from "../../../../shared/base/inputs/input-text/input-text.component";
import { SelectComponent } from "../../../../shared/base/select/select.component";
import { InputPhoneComponent } from "../../../../shared/base/inputs/input-phone/input-phone.component";
import { FileUploadNewComponent } from "../../../../shared/base/upload-files/upload-files.component";
import { ButtonComponent } from "../../../../shared/base/button/button.component";

@Component({
  selector: 'app-users-edit-local',
  templateUrl: './users-edit-local.component.html',
  styleUrls: ['./users-edit-local.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent, 
    SelectComponent, 
    InputPhoneComponent, 
    InputCheckboxOptionGroupComponent, 
    FileUploadNewComponent, 
    ButtonComponent
  ],
})
export class UsersEditLocalComponent implements OnInit {
  _skipFormValidation = signal(true);
  readonly FileType = FileType;
  Icons = ConstPath;
  @Input() userForm!: FormGroup;
  @Input() currentAuthority!: string;
  @Output() isPasswordReset = new EventEmitter<boolean>();

  disableEdit = signal<boolean>(false);
  userFields = signal(userLocalFields.filter((f) => f.name !== 'password'));
  FieldTypeEnum = FieldTypeEnum;
  fileTypes = signal<IdValuePair[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  uploadedFile = signal<File | null>(null);
  selectedValues = signal<string[]>([]);
  dynamicOptions = signal<any[]>([]);
  selectedGroup = signal<any>(null);
  signFileTitle = signal<string>('דוגמת חתימה');
  optionsApps = signal<CheckboxOption[]>([
    { value: 'מסופון', label: 'מסופון', checked: false },
    { value: 'מערכת', label: 'מערכת', checked: false },
  ]);
  optionsPermissions = signal<CheckboxOption[]>([
    { value: 1, label: 'מנהלי', checked: false },
    { value: 3, label: 'חניה', checked: false },
    { value: 2, label: 'כללי', checked: false },
    { value: 4, label: 'אכיפה', checked: false },
  ]);

  constructor(
    private usersService: UsersService,
    private toaster: ToastrService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {  
    this.userForm.get('id')?.disable();
    this.fetchRoles();
    this.checkEditPermission();
  }

  checkEditPermission(): void {
    const shouldDisable =
      !this.permissionService.checkUserPermission('User/update/local') ||
      this.userForm?.get('email')?.value === this.permissionService.email;
    
    this.disableEdit.set(shouldDisable);
    this.setFormControlsDisabled(shouldDisable);
    this.setFieldsDisabled(shouldDisable);
  }

  private setFormControlsDisabled(disable: boolean): void {
    Object.values(this.userForm.controls).forEach((control) => {
      disable ? control.disable() : control.enable();
    });
  }

  private setFieldsDisabled(disable: boolean): void {
    // Field disabled state is now managed through FormControl only
    // This method is kept for potential future use but doesn't modify field properties
  }

  async updateLocalUser() {
    this._skipFormValidation.set(false);
    this.userForm.removeControl('password');

    const enabledControlsValid = Object.keys(this.userForm.controls)
      .filter(
        (key) => this.userForm.get(key) && !this.userForm.get(key)!.disabled
      )
      .every((key) => this.userForm.get(key)?.valid);

    if (enabledControlsValid) {
      try {
        // Use `getRawValue` to include disabled fields
        const formData = { ...this.userForm.getRawValue() };
        // Handle file conversion to Base64
        const currentUploadedFile = this.uploadedFile();
        if (currentUploadedFile) {
          formData['signFile'] = await Utils.convertFileToBase64(
            currentUploadedFile
          );
        }
        formData['accessType'] = this.selectedValues();

        // Transform groupAccess array into GroupsToAdd format
        let groupAccess = formData['groupAccess'];
        let appAccess = formData['appAccess'];

        if (!Array.isArray(groupAccess)) {
          groupAccess = [groupAccess].filter(Boolean);
        } else {
          groupAccess = groupAccess.flat(); // Flatten nested arrays
        }

        const dataAccess = formData['dataAccess'];
        const dataAccessArray =
          typeof dataAccess === 'string'
            ? dataAccess.split(',').map(Number)
            : [];

        const appAccessArray =
          typeof appAccess === 'string' ? appAccess.split(',').map(Number) : [];
        const groupsToAdd = groupAccess.map((roleId: number) => {
          return { RoleID: roleId };
        });

        const dataToAdd = dataAccessArray.map((roleId: number) => {
          return { RoleID: roleId };
        });

        const appsToAdd = appAccessArray.map((roleId: number) => ({
          RoleID: Number(roleId),
        }));

        const combinedRoles = [...groupsToAdd, ...dataToAdd, ...appsToAdd];
        // Assign transformed groups to groupsAssign
        formData['groupsAssign'] = {
          AuthorityId: this.currentAuthority,
          GroupsToAdd: combinedRoles,
        };

        delete formData['dataAccess'];
        delete formData['groupAccess'];
        delete formData['appAccess'];

        let currentUser: any = this.sessionService.get('user');
        formData['userID'] = currentUser.userID;
        const res = await this.usersService.updateUserLocal(formData);

        if (res) {
          this.toaster.success(ErrorSuccessMessages.USER_UPDATED_SUCCESSFULY);
          this.routerService.back();
        }
      } catch (error) {
        this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
        console.error('Error updating user', error);
      }
    } else {
      console.log('Form is not valid');

      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.log(this.userForm.value); // This will NOT include disabled fields
    }
  }

  isFieldValid(fieldName: string): boolean {
    return this.userForm.get(fieldName)?.valid || this._skipFormValidation();
  }

  onSelectionChange(selectedValues: any, fieldName: string): void {
    this.userForm.patchValue({ [fieldName]: selectedValues.join(',') });
  }

  resetPassword(): void {
    this.isPasswordReset.emit(true);
  }

  getUploadedFile(file: File): void {
    this.uploadedFile.set(file);
  }
  changeGroup(event: any): void {
    if (!event?.value) return;

    // Get the current selected values
    let selectedValues = this.userForm.get('groupAccess')?.value || [];

    if (!Array.isArray(selectedValues)) {
      selectedValues = [];
    }

    if (!selectedValues.includes(event.value)) {
      selectedValues.push(event.value);
    } else {
      selectedValues = selectedValues.filter((val: any) => val !== event.value);
    }
    // Update the form control
    this.userForm.get('groupAccess')?.setValue(selectedValues);
  }
  async fetchRoles() {
    try {
      const response = await this.usersService.getGroups();

      // Process roles into categorized lists
      this.optionsApps.set(this.getFilteredRoles(response, ['מסופון', 'מערכת']));
      this.optionsPermissions.set(this.getFilteredRoles(response, [
        'חניה',
        'כללי',
        'מנהלי',
        'אכיפה',
      ]));
      this.dynamicOptions.set(this.getDynamicRoles(response));

      //  Update form fields if `userForm` exists
      if (this.userForm) {
        this.updateFormField('groupAccess', response, [], true); // `true` flag for selectedGroup
        this.updateFormField('dataAccess', response, this.optionsPermissions());
        this.updateFormField('appAccess', response, this.optionsApps());
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }

  //helper functions

  private getFilteredRoles(
    response: any[],
    roleNames: string[]
  ): CheckboxOption[] {
    return response
      .filter((role) => roleNames.includes(role.value))
      .map((role) => ({ value: role.id, label: role.value, checked: false }));
  }

  private getDynamicRoles(
    response: any[]
  ): { value: number; display: string }[] {
    const allExcludedRoles = [
      'מסופון',
      'מערכת',
      'חניה',
      'כללי',
      'מנהלי',
      'אכיפה',
    ];
    return response
      .filter((role) => !allExcludedRoles.includes(role.value))
      .map((role) => ({ value: role.id, display: role.value }));
  }

  private updateFormField(
    fieldName: string,
    response: any[],
    optionsList?: CheckboxOption[],
    updateSelectedGroup: boolean = false // Flag to update `selectedGroup`
  ) {
    const selectedNames = this.userForm.get(fieldName)?.value;
    if (!selectedNames) return;

    // Handle different types of selectedNames values
    let namesArray: string[] = [];
    
    if (typeof selectedNames === 'string') {
      // If it's a string, split by comma
      namesArray = selectedNames.split(', ').filter(name => name.trim());
    } else if (Array.isArray(selectedNames)) {
      // If it's already an array, use it directly
      namesArray = selectedNames.map(item => 
        typeof item === 'object' && item !== null ? item.value || item.name || item.label || String(item) : String(item)
      );
    } else if (typeof selectedNames === 'object' && selectedNames !== null) {
      // If it's an object, try to extract the value
      namesArray = [selectedNames.value || selectedNames.name || selectedNames.label || String(selectedNames)];
    } else {
      // Fallback: convert to string
      namesArray = [String(selectedNames)];
    }

    // Convert selected names to corresponding IDs
    const selectedIds = response
      .filter((role) => namesArray.includes(role.value))
      .map((role) => role.id);

    this.userForm.patchValue({ [fieldName]: selectedIds });

    //  If `groupAccess` field, also update `selectedGroup`
    if (updateSelectedGroup) {
      this.selectedGroup.set(selectedIds);
    }
    //  If optionsList exists (for checkboxes), update the checked state
    if (optionsList) {
      const updatedOptions = optionsList.map(option => ({
        ...option,
        checked: selectedIds.includes(option.value)
      }));
      
      // Update the appropriate signal based on the fieldName
      if (fieldName === 'dataAccess') {
        this.optionsPermissions.set(updatedOptions);
      } else if (fieldName === 'appAccess') {
        this.optionsApps.set(updatedOptions);
      }
    }
  }

  //validation
  isCheckboxFieldValid(name: string): boolean {
    let control;
    if (name == 'appAccess') {
      control = this.userForm.controls['appAccess'];
    }
    if (name == 'dataAccess') {
      control = this.userForm.controls['dataAccess'];
    }

    // Ensure the controls exist
    if (!control) {
      return this.isFieldValid(name); // No controls to validate
    }

    const controlVal = control?.value;

    if (controlVal) {
      return true; // Valid if at least one checkbox is selected
    }

    return this.isFieldValid(name); // Invalid if none are selected
  }
}
