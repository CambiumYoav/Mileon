import { Component, Input, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { noticesFields } from '../../../types/notices/notice-form-fileds';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';

@Component({
  selector: 'app-notices-pre-and-payment-messages',
  templateUrl: './notices-pre-and-payment-messages.component.html',
  styleUrls: ['./notices-pre-and-payment-messages.component.scss'],
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
export class NoticesPreAndPaymentMessagesComponent implements OnInit {
  readonly Icons = ConstPath; 
  readonly preAndPaymentNoticesFields = noticesFields;
  readonly FieldTypeEnum = FieldTypeEnum;

  @Input() noticeForm!: FormGroup;
  
  private readonly _skipFormValidation = signal<boolean>(true);

  @Input() set skipFormValidation(value: boolean) {
    this._skipFormValidation.set(value);
  }

  get skipFormValidation(): boolean {
    return this._skipFormValidation();
  }

  readonly notVisibleFields = signal<string[]>([
    'dateFrom',
    'fromPaymentBalance',
    'toPaymentBalance',
    'fromFeeBalance',
    'toFeeBalance',
    'postStatus',
    'determiningDateFrom',
    'determiningDateTo',
  ]);

  readonly filteredFields = computed(() => {
    return this.preAndPaymentNoticesFields.filter(
      (field) => !this.notVisibleFields().includes(field.name)
    );
  });

  isFieldValid(fieldName: string): boolean {
    return this.noticeForm.get(fieldName)?.valid || this._skipFormValidation();
  }

  ngOnInit(): void {
    console.log(this.noticeForm);
  }
}
