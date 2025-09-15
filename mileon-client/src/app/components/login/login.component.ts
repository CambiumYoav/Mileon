import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../constants/const_path';
import { ModalButton } from '../../constants/modalButtons';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { SessionService } from '../../services/session.service';
import { ButtonTypesEnum } from '../../types/enum/button.enum';
import { ErrorSuccessMessages } from '../../types/enum/error-success-messages';
import { BaseComponents, SharedImports } from '../../shared/shared-modules';

@Component({
  selector: 'app-login',
  imports: [...SharedImports, ...BaseComponents],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  Icons = ConstPath;
  buttonType = ButtonTypesEnum.Submit;
  loader: boolean = false;
  isModalOpen: boolean = false;
  modalButtons: ModalButton[] = this.createModalButtons();
  loginForm: any;

  private authService = inject(AuthService);
  public sessionService = inject(SessionService);
  private permissionService = inject(PermissionService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  constructor() {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
    if (this.permissionService.hasToken()) {
      this.router.navigate(['/home']);
    } else {
      this.sessionService.clear();
    }
  }

  login() {
    this.loader = true;
    this.authService
      .login({
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!,
      })
      ?.subscribe((res) => {
        this.loader = false;
        if (res.permissions && res.token) {
          this.toastr.success(ErrorSuccessMessages.LOGIN_SUCCESSFULY);
          this.sessionService.set('token', res.token);
          this.sessionService.set('permission', res.permissions);
          this.permissionService.refreshPermissions();
          this.router.navigate(['/home']);
        }
      });
    this.loader = false;
  }

  createModalButtons(): ModalButton[] {
    return [{ label: 'סגור', action: () => this.closeModal() }];
  }

  closeModal() {
    this.forgotPassword();
    this.isModalOpen = false;
  }

  onLinkClick() {
    this.isModalOpen = true;
  }

  async forgotPassword() {
    try {
      // { userId: userId }
      const userObject = {};
      const res = await this.authService.forgotPassword(userObject);
    } catch (e) {}
  }
}
