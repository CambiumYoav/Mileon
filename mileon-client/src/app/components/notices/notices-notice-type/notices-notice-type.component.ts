import { Component, Input, OnInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy, effect, ChangeDetectorRef, runInInjectionContext, Injector } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConstPath } from '../../../constants/const_path';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { noticeMessageOptionsEnum } from '../../../types/enum/noticeNessageOptionsEnum';
import { PostTypeEnum } from '../../../types/enum/noticesInterfacesEnum';
import {
  noticeOptionFields,
  disabledNoticeOptionFields
} from '../../../types/notices/notice-form-fileds';
import {
  AuthorityPaymentSetting,
  coerceToCategory,
  MESSAGE_TO_SETTING,
  pickIntSetting,
} from '../../../types/notices/notices-days-to-pay';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { InputCheckboxComponent } from '../../shared/base/inputs/input-checkbox/input-checkbox.component';

@Component({
  selector: 'app-notices-notice-type',
  templateUrl: './notices-notice-type.component.html',
  styleUrls: ['./notices-notice-type.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    SelectComponent,
    InputDateComponent,
    InputCheckboxComponent
  ]
})
export class NoticesNoticeTypeComponent implements OnInit, OnDestroy {
  readonly Icons = ConstPath;
  readonly noticeOptionFields = noticeOptionFields;
  readonly disabledNoticeOptionFields = disabledNoticeOptionFields;
  readonly FieldTypeEnum = FieldTypeEnum;

  @Input() notVisibleFields: string[] = [];
  @Input() noticeForm!: FormGroup;
  
  private readonly _skipFormValidation = signal<boolean>(true);
  private readonly _isDisabledForm = signal<boolean>(false);
  private readonly _fields = signal<any[]>([]);
  private readonly _settings = signal<AuthorityPaymentSetting[]>([]);

  @Input() set skipFormValidation(value: boolean) {
    this._skipFormValidation.set(value);
  }

  @Input() set settings(value: AuthorityPaymentSetting[]) {
    this._settings.set(value);
  }

  get skipFormValidation(): boolean {
    return this._skipFormValidation();
  }

  readonly isDisabledForm = computed(() => this._isDisabledForm());
  readonly fields = computed(() => this._fields());

  readonly filteredFields = computed(() => {
    const base = this.isDisabledForm()
      ? this.disabledNoticeOptionFields
      : this.noticeOptionFields;
    return base.filter((f: any) => !this.notVisibleFields?.includes(f.name));
  });

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  private msgCtrlSignal: any;
  private popCtrlSignal: any;
  private daysMsgCtrlSignal: any;
  private daysTypeCtrlSignal: any;

  constructor() {
    // No effects in constructor to avoid reactive context issues
  }

  private enforceSendingTypeByMessage(msg: noticeMessageOptionsEnum) {
    const sendingTypeCtrl = this.noticeForm.get(
      'sendingType'
    ) as FormControl | null;
    if (!sendingTypeCtrl) return;

    const isSpecialPopulation = !!(
      this.noticeForm.get('populationType') as FormControl | null
    )?.value;

    const opts = { emitEvent: false };

    if (isSpecialPopulation) {
      sendingTypeCtrl.enable(opts);
      sendingTypeCtrl.setValue(PostTypeEnum.RegisteredMail, opts);
      sendingTypeCtrl.disable(opts);
      this.setUiDisabled(true);
      return;
    }

    switch (msg) {
      case noticeMessageOptionsEnum.PreNotice:
        sendingTypeCtrl.enable(opts);
        sendingTypeCtrl.setValue(PostTypeEnum.RegularMail, opts);
        sendingTypeCtrl.disable(opts);
        this.setUiDisabled(true);
        break;

      case noticeMessageOptionsEnum.PaymentNotice:
        sendingTypeCtrl.enable(opts);
        sendingTypeCtrl.setValue(PostTypeEnum.RegisteredMail, opts);
        sendingTypeCtrl.disable(opts);
        this.setUiDisabled(true);
        break;

      case noticeMessageOptionsEnum.DemandNotice:
        sendingTypeCtrl.enable(opts);
        sendingTypeCtrl.setValue(PostTypeEnum.RegularMail, opts);
        sendingTypeCtrl.disable(opts);
        this.setUiDisabled(true);
        this.applySingleFieldValidators();
        break;

      case noticeMessageOptionsEnum.Form3:
        sendingTypeCtrl.enable(opts);
        sendingTypeCtrl.setValue(PostTypeEnum.RegisteredMail, opts);
        sendingTypeCtrl.disable(opts);
        this.setUiDisabled(true);
        this.applySingleFieldValidators();
        break;

      case noticeMessageOptionsEnum.DebtReminder:
        this.applySingleFieldValidators();
        sendingTypeCtrl.enable(opts);
        this.setUiDisabled(false);
        break;

      default:
        sendingTypeCtrl.enable(opts);
        this.setUiDisabled(false);
        break;
    }
  }

  private setUiDisabled(disabled: boolean) {
    this._isDisabledForm.set(disabled);

    this._fields.set(disabled
      ? this.disabledNoticeOptionFields
      : this.noticeOptionFields);

    this.cdr.markForCheck();
  }

  private wireDaysForPaymentComputation() {
    const msgCtrl = this.noticeForm.get(
      'noticeMessageOptionId'
    ) as FormControl | null;

    const typeCtrl = this.noticeForm.get('ticketTypeID') as FormControl | null;
    const daysCtrl = this.noticeForm.get('dayToPay') as FormControl | null;

    if (!msgCtrl || !typeCtrl || !daysCtrl) return;

    this.daysMsgCtrlSignal = toSignal(msgCtrl.valueChanges, { initialValue: msgCtrl.value });
    this.daysTypeCtrlSignal = toSignal(typeCtrl.valueChanges, { initialValue: typeCtrl.value });

    effect(() => {
      const msg = this.daysMsgCtrlSignal();
      const typeVal = this.daysTypeCtrlSignal();
      const settings = this._settings();
      
      // Check if we have a message type (required for computation)
      if (msg !== null && msg !== undefined) {
        const settingName = MESSAGE_TO_SETTING[msg as noticeMessageOptionsEnum];
        
        if (settingName) {
          // If we have a ticket type, use it; otherwise use 'General' as fallback
          const category = typeVal !== null && typeVal !== undefined 
            ? coerceToCategory(typeVal as any)
            : 'General';
          
          const days = pickIntSetting(settings, settingName, category);

          daysCtrl.setValue(days ?? null, { emitEvent: false });
          daysCtrl.updateValueAndValidity({ emitEvent: false });
          this.cdr.markForCheck();
        } else {
          daysCtrl.setValue(null, { emitEvent: false });
          daysCtrl.updateValueAndValidity({ emitEvent: false });
          this.cdr.markForCheck();
        }
      } else {
        // Clear the days field when message type is not available
        daysCtrl.setValue(null, { emitEvent: false });
        daysCtrl.updateValueAndValidity({ emitEvent: false });
        this.cdr.markForCheck();
      }
    });
  }
  ngOnInit(): void {
    const msgCtrl = this.noticeForm.get(
      'noticeMessageOptionId'
    ) as FormControl | null;
    const popCtrl = this.noticeForm.get('populationType') as FormControl | null;

    runInInjectionContext(this.injector, () => {
      if (msgCtrl) {
        this.enforceSendingTypeByMessage(msgCtrl.value);

        this.msgCtrlSignal = toSignal(msgCtrl.valueChanges, { initialValue: msgCtrl.value });
        
        effect(() => {
          const val = this.msgCtrlSignal();
          if (val !== null && val !== undefined) {
            this.enforceSendingTypeByMessage(val as noticeMessageOptionsEnum);
          }
        });
      }

      if (popCtrl) {
        this.popCtrlSignal = toSignal(popCtrl.valueChanges, { initialValue: popCtrl.value });
        
        effect(() => {
          const val = this.popCtrlSignal();
          if (val !== null && val !== undefined) {
            const messageType = msgCtrl?.value;
            if (messageType !== null && messageType !== undefined) {
              this.enforceSendingTypeByMessage(messageType as noticeMessageOptionsEnum);
            }
          }
        });
      }

      this.wireDaysForPaymentComputation();
    });
  }

  ngOnDestroy(): void {
    // Clean up form validators
    ['additionalFee'].forEach((ctrlName) => {
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
    const c = this.noticeForm.get(fieldName);
    if (!c) return true;
    if (this._skipFormValidation()) return true;
    return c.disabled || c.valid; // <- disabled considered OK
  }

  private applySingleFieldValidators(): void {
    this.setValidators('additionalFee', [Validators.required]);
  }
  private setValidators(controlName: string, validators: ValidatorFn[]) {
    const ctrl = this.noticeForm.get(controlName);
    if (!ctrl) return;
    ctrl.setValidators(validators);
    ctrl.updateValueAndValidity({ emitEvent: false });
  }
}
