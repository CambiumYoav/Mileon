import { Component, Input, OnInit, signal, computed, inject, effect } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldTypeEnum } from '../../../../../types/advanced-search/form-tab.model';
import { FileType } from '../../../../../types/enum/fileType.enum';
import { IdValuePair } from '../../../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../../../types/uploadedFile';
import { userLocalFields } from '../../../../../types/users/user-form-fields';
import { UsersService } from '../../users.service';
import { Utils } from '../../../../../utils/utils';
import { CheckboxOption, InputCheckboxOptionGroupComponent } from '../../../../../components/shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../../../types/enum/error-success-messages';
import { RouterService } from '../../../../../services/router.service';
import { ConstPath } from '../../../../../constants/const_path';
import { InputTextComponent } from "../../../../shared/base/inputs/input-text/input-text.component";
import { SelectComponent } from "../../../../shared/base/select/select.component";
import { InputPhoneComponent } from "../../../../shared/base/inputs/input-phone/input-phone.component";
import { FileUploadNewComponent } from "../../../../shared/base/upload-files/upload-files.component";
import { ButtonComponent } from "../../../../shared/base/button/button.component";

@Component({
  selector: 'app-users-create-local',
  templateUrl: './users-create-local.component.html',
  styleUrls: ['./users-create-local.component.scss'],
  imports: [ReactiveFormsModule, InputTextComponent, SelectComponent, InputPhoneComponent, InputCheckboxOptionGroupComponent, FileUploadNewComponent, ButtonComponent],
})
export class UsersCreateLocalComponent implements OnInit {
  private usersService = inject(UsersService);
  private toaster = inject(ToastrService);
  private routerService = inject(RouterService);

  readonly FileType = FileType;
  Icons = ConstPath;
  userFields = userLocalFields;
  FieldTypeEnum = FieldTypeEnum;

  @Input() userForm!: FormGroup;
  @Input() currentAuthority!: string;

  private _skipFormValidation = signal(true);
  fileTypes = signal<IdValuePair[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  uploadedFile = signal<File | null>(null);
  selectedValuesApps = signal<string>('');
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

  constructor() {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  isValidIsraeliID(): boolean {
    const idControl = this.userForm.controls['id'];
    let id = this.userForm.controls['id'].value;

    // Ensure password exists
    if (!idControl || !idControl.value) {
      return this.isFieldValid('id'); // No validation errors if the password is empty
    }

    id = id.padStart(9, '0');
    if (!/^\d{9}$/.test(id)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = +id[i] * (i % 2 === 0 ? 1 : 2);
      sum += num > 9 ? num - 9 : num;
    }
    return sum % 10 === 0;
  }

  async createLocalUser() {
    this._skipFormValidation.set(false);

    if (this.userForm.valid) {
      try {
        console.log('Form Data:', this.userForm.value);
        const formData = { ...this.userForm.value };

        let groupAccess = formData['groupAccess'];
        let dataAccess = formData['dataAccess'];
        let appAccess = formData['appAccess'];

        if (!Array.isArray(groupAccess)) {
          groupAccess = [groupAccess].filter(Boolean);
        } else {
          groupAccess = groupAccess.flat(); // Flatten nested arrays
        }

        const appAccessArray =
          typeof appAccess === 'string' ? appAccess.split(',').map(Number) : [];

        const dataAccessArray =
          typeof dataAccess === 'string'
            ? dataAccess.split(',').map(Number)
            : [];

        const currentUploadedFile = this.uploadedFile();
        if (currentUploadedFile) {
          formData['signFile'] = await Utils.convertFileToBase64(
            currentUploadedFile
          );
        }

        const groupsToAdd = groupAccess.map((roleId: number) => ({
          RoleID: Number(roleId), // Ensure it's a number, not an array
        }));

        const dataToAdd = dataAccessArray.map((roleId: number) => ({
          RoleID: Number(roleId),
        }));

        const appsToAdd = appAccessArray.map((roleId: number) => ({
          RoleID: Number(roleId),
        }));

        const combinedRoles = [...groupsToAdd, ...dataToAdd, ...appsToAdd];

        formData['groupsAssign'] = {
          AuthorityId: this.currentAuthority,
          GroupsToAdd: combinedRoles,
        };

        delete formData['dataAccess'];
        delete formData['groupAccess'];
        delete formData['appAccess'];

        const res = await this.usersService.createUserLocal(formData);
        if (res) {
          this.toaster.success(ErrorSuccessMessages.USER_CREATED_SUCCESSFULY);
          this.routerService.back();
        }
      } catch (error) {
        console.log('Error:', error);
        this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      }
    } else {
      console.log('Form is not valid:', this.userForm.value);
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  isFieldValid(fieldName: string): boolean {
    return this.userForm.get(fieldName)?.valid || this._skipFormValidation();
  }

  getUploadedFile(file: File): void {
    this.uploadedFile.set(file);
  }

  onSelectionChange(selectedValues: any, fieldName: string): void {
    // console.log(selectedValues);
    this.userForm.patchValue({ [fieldName]: selectedValues.join(',') });
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

      // Define role names to filter
      const appRoles = ['מסופון', 'מערכת'];
      const permissionRoles = ['חניה', 'כללי', 'מנהלי', 'אכיפה'];

      // Filter optionsApps
      const filteredAppsOptions = response
        .filter((role: any) => appRoles.includes(role.value))
        .map((role: any) => ({ value: role.id, label: role.value, checked: false }));
      this.optionsApps.set(filteredAppsOptions);

      // Filter optionsPermissions
      const filteredPermissionsOptions = response
        .filter((role: any) => permissionRoles.includes(role.value))
        .map((role: any) => ({ value: role.id, label: role.value, checked: false }));
      this.optionsPermissions.set(filteredPermissionsOptions);

      // Filter dynamicOptions to include only items **not in** optionsApps or optionsPermissions
      const filteredDynamicOptions = response
        .filter(
          (role: any) =>
            !appRoles.includes(role.value) &&
            !permissionRoles.includes(role.value)
        )
        .map((role: any) => ({ value: role.id, display: role.value }));
      this.dynamicOptions.set(filteredDynamicOptions);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }

  isPasswordFieldIsValid() {
    const passwordControl = this.userForm.controls['password'];
    const emailControl = this.userForm.controls['email'];
    const phoneControl = this.userForm.controls['phone'];

    // Ensure password exists
    if (!passwordControl || !passwordControl.value) {
      return this.isFieldValid('password'); // No validation errors if the password is empty
    }

    const password = passwordControl.value;
    const email = emailControl?.value;
    const phone = phoneControl?.value;
    

    // Check if the password contains the email
    if (email && password.includes(email)) {
      return false;
    }

    // Check if the password contains the phone
    if (phone && password.includes(phone)) {
      return false;
    }

    return this.isFieldValid('password'); // Password is valid
  }

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
