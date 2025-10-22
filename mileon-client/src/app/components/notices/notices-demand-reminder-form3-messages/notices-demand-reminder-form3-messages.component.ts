import { Component, Input, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { noticesFields } from '../../../types/notices/notice-form-fileds';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';

@Component({
  selector: 'app-notices-demand-reminder-form3-messages',
  templateUrl: './notices-demand-reminder-form3-messages.component.html',
  styleUrls: ['./notices-demand-reminder-form3-messages.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    SelectComponent,
    InputDateComponent
  ]
})
export class NoticesDemandReminderForm3MessagesComponent implements OnInit, OnDestroy {
  readonly Icons = ConstPath;
  readonly demandAndReminderNoticesFields = noticesFields;
  readonly FieldTypeEnum = FieldTypeEnum;

  @Input() noticeForm!: FormGroup;
  
  private readonly _skipFormValidation = signal<boolean>(true);

  @Input() set skipFormValidation(value: boolean) {
    this._skipFormValidation.set(value);
  }

  get skipFormValidation(): boolean {
    return this._skipFormValidation();
  }

  ngOnInit(): void {
    this.applySingleFieldValidators();
  }

  ngOnDestroy(): void {
    ['determiningDateFrom', 'fromPaymentBalance'].forEach((ctrlName) => {
      const ctrl = this.noticeForm.get(ctrlName);
      if (ctrl) {
        ctrl.clearValidators();
        ctrl.updateValueAndValidity({ emitEvent: false });
      }
    });

    this.noticeForm.clearValidators();
    this.noticeForm.updateValueAndValidity({ emitEvent: false });
  }

  isFieldValid(fieldName: string): boolean {
    return this.noticeForm.get(fieldName)?.valid || this._skipFormValidation();
  }

  private applySingleFieldValidators(): void {
    this.setValidators('determiningDateFrom', [Validators.required]);
    this.setValidators('fromPaymentBalance', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]);
  }

  private setValidators(controlName: string, validators: ValidatorFn[]) {
    const ctrl = this.noticeForm.get(controlName);
    if (!ctrl) return;
    ctrl.setValidators(validators);
    ctrl.updateValueAndValidity({ emitEvent: false });
  }
}
