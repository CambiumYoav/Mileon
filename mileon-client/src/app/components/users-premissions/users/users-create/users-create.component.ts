import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseFormService } from '../../../../components/shared/base-form/base-form.service'; 
import { RouterService } from '../../../../services/router.service';
import { ConstPath } from '../../../../constants/const_path';
import { AuthorityService } from '../../../../services/authority.service ';
import { FieldTypeEnum } from '../../../../types/advanced-search/form-tab.model';
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { UserForm, usersValidation } from '../../../../types/users/user-form';
import { userFields } from '../../../../types/users/user-form-fields';
import { UsersCreateLocalComponent } from "./users-create-local/users-create-local.component";
import { UsersCreateNationalComponent } from "./users-create-national/users-create-national.component";
import { ButtonComponent } from "../../../shared/base/button/button.component";

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss'],
  imports: [UsersCreateLocalComponent, UsersCreateNationalComponent, ButtonComponent],
})
export class UsersCreateComponent implements OnInit {
  private baseFormService = inject(BaseFormService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);

  title = signal<string>(TitlesEnum.CreateUsersTitle);
  
  private authorityIdSignal = toSignal(this.authorityService.authorityId$, { initialValue: '' });
  
  currentAuthority = computed(() => this.authorityIdSignal() || '');
  isMviewAuthority = computed(() => 
    this.currentAuthority() === '11111111-1111-1111-1111-111111111111'
  );

  userFields = userFields;
  FieldTypeEnum = FieldTypeEnum;
  Icons = ConstPath;

  userForm: FormGroup;

  constructor() {
    this.userForm = this.baseFormService.createFormGroup(UserForm);
    this.baseFormService.setValidations(this.userForm, usersValidation);
  }

  ngOnInit(): void {
    // Authority subscription is now handled in the constructor effect
  }

  back() {
    this.routerService.back();
  }
}
