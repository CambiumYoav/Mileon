import { Component, OnInit, OnDestroy, ViewChild, signal, computed, inject, ChangeDetectionStrategy, effect, runInInjectionContext, Injector } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionButtonNames } from '../../../constants/action_buttons';
import { ConstPath } from '../../../constants/const_path';
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import { Buttons as ActionButtonsEnum } from '../../../constants/buttonEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { ModuleEnum } from '../../../types/enum/moduleEnum';
import { noticeMessageOptionsEnum } from '../../../types/enum/noticeNessageOptionsEnum';
import { noticeTypeOptions } from '../../../types/enum/noticeTypeOptionsEnum';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { TicketNew } from '../../../types/ticket';
import { noticeMessagesFields } from '../../../types/notices/notice-message';
import {
  NoticeForm,
  noticeValidation,
} from '../../../types/notices/notice-form';
import { Utils } from '../../../utils/utils';
import { ActionButtonsComponent } from '../../shared/action-buttons/action-buttons.component';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { TicketsSearchFormService } from '../../tickets-new/tickets-search/tickets-search-form.service';
import { TicketsService } from '../../tickets-new/tickets.service';
import { NoticesService } from '../notices.service';
import { AuthorityService } from '../../../services/authority.service ';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { PermissionService } from '../../../services/permission.service';
import { InterfaceTypes } from '../../../types/enum/noticesInterfacesEnum';
import { TimelineService } from '../../authority-management/timeline.service';
import { SelectComponent } from '../../shared/base/select/select.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { AppModalComponent } from '../../shared/app-modal/app-modal.component';
import { NoticesPreAndPaymentMessagesComponent } from '../notices-pre-and-payment-messages/notices-pre-and-payment-messages.component';
import { NoticesDemandReminderForm3MessagesComponent } from '../notices-demand-reminder-form3-messages/notices-demand-reminder-form3-messages.component';
import { NoticesNoticeTypeComponent } from '../notices-notice-type/notices-notice-type.component';

@Component({
  selector: 'app-notices-main',
  templateUrl: './notices-main.component.html',
  styleUrls: ['./notices-main.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectComponent,
    ButtonComponent,
    AppModalComponent,
    NoticesPreAndPaymentMessagesComponent,
    NoticesDemandReminderForm3MessagesComponent,
    NoticesNoticeTypeComponent
  ]
})
export class NoticesMainComponent implements OnInit, OnDestroy {
  readonly Buttons = ActionButtonsEnum;
  readonly title = signal<string>(TitlesEnum.NoticesTitle);
  readonly Icons = ConstPath;
  readonly moduleEnum = ModuleEnum;
  readonly noticeMessagesFields = noticeMessagesFields;
  readonly notVisibleTypeDemand = signal<any[]>([]);
  readonly notVisibleType = signal<string[]>(['additionalFee', 'debatorMail']);
  readonly resultCountMessage = signal<string>('תוצאות חיפוש');

  private readonly _activatedAuthorityID = signal<string>('');
  private readonly _selectedMessageType = signal<noticeMessageOptionsEnum | null>(null);
  private readonly _selecteNoticeType = signal<string>('');
  private readonly _formModified = signal<boolean>(false);
  private readonly _isChangingNoticeModalOpen = signal<boolean>(false);
  private readonly _list = signal<TicketNew[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _count = signal<number>(0);
  private readonly _ticketIDsList = signal<string[]>([]);
  private readonly _skipFormValidation = signal<boolean>(true);
  private readonly _isFirstSelection = signal<boolean>(true);
  private readonly _ticketsFilters = signal<TicketFilterOptions | null>(null);
  private readonly _enforcmentRes = signal<any>(null);
  private readonly _selectedNoticeType = signal<boolean>(false);
  private readonly _isCraeteDisabled = signal<boolean>(false);
  private readonly _isTestExported = signal<boolean>(false);
  private readonly _pendingMessageType = signal<noticeMessageOptionsEnum | null>(null);

  readonly activatedAuthorityID = computed(() => this._activatedAuthorityID());
  readonly selectedMessageType = computed(() => this._selectedMessageType());
  readonly selecteNoticeType = computed(() => this._selecteNoticeType());
  readonly formModified = computed(() => this._formModified());
  readonly isChangingNoticeModalOpen = computed(() => this._isChangingNoticeModalOpen());
  readonly list = computed(() => this._list());
  readonly total = computed(() => this._total());
  readonly count = computed(() => this._count());
  readonly ticketIDsList = computed(() => this._ticketIDsList());
  readonly skipFormValidation = computed(() => this._skipFormValidation());
  readonly isFirstSelection = computed(() => this._isFirstSelection());
  readonly ticketsFilters = computed(() => this._ticketsFilters());
  readonly enforcmentRes = computed(() => this._enforcmentRes());
  readonly selectedNoticeType = computed(() => this._selectedNoticeType());
  readonly isCraeteDisabled = computed(() => this._isCraeteDisabled());
  readonly isTestExported = computed(() => this._isTestExported());

  readonly modalTitle = signal<string>(ModalMessages.CHANGE_TYPE);
  readonly modalButtons = signal<ModalButton[]>(this.createModalButtons());

  noticeForm!: FormGroup;

  private readonly baseFormService = inject(BaseFormService);
  private readonly ticketsSearchFormService = inject(TicketsSearchFormService);
  private readonly ticketsService = inject(TicketsService);
  private readonly noticesService = inject(NoticesService);
  private readonly authorityService = inject(AuthorityService);
  private readonly toaster = inject(ToastrService);
  private readonly permissionService = inject(PermissionService);
  private readonly timelineService = inject(TimelineService);
  private readonly injector = inject(Injector);

  private readonly authorityIDSignal = toSignal(this.authorityService.authorityId$, { initialValue: '' });
  
  private formValueChangesSignal!: any;
  private msgCtrlSignal!: any;
  private typeCtrlSignal!: any;

  constructor() {
    this.noticeForm = this.baseFormService.createFormGroup(NoticeForm);
    this.baseFormService.setValidations(this.noticeForm, noticeValidation);

    effect(() => {
      const authorityID = this.authorityIDSignal();
      if (authorityID && authorityID !== '') {
        this._activatedAuthorityID.set(authorityID);
        console.log('Authority changed:', authorityID);
        this.clearFormFields();
        this.onAuthorityChanged(authorityID);
      }
    });
  }

  ngOnInit(): void {
    this.initializeFormListeners();
    this._skipFormValidation.set(true);
    this._isFirstSelection.set(true);
    this._formModified.set(false);
    this.authorityService.setMunicipalsToNationalRegional();
  }

  ngOnDestroy(): void {
    this._selectedNoticeType.set(false);
    this._isTestExported.set(false);
  }

  private onAuthorityChanged(id: string): void {
    const wasSkipValidation = this.skipFormValidation();
    this._skipFormValidation.set(true);
    this._isCraeteDisabled.set(true);
    const ctrl = this.noticeForm.get('authorityID') as FormControl;
    if (ctrl) {
      ctrl.setValue(id, { emitEvent: false });
      ctrl.updateValueAndValidity({ emitEvent: false });
    }

    this.resetAuthorityDependents();

    this.loadData(this.ticketsSearchFormService.form.value);
    this.getTimelineSettings();

    // Use proper state management instead of arbitrary timeout
    this._skipFormValidation.set(wasSkipValidation);
    this._isFirstSelection.set(false);
    this._isTestExported.set(false);
  }

  private resetAuthorityDependents(): void {
    const dependents = ['engraving', 'messageType'];

    dependents.forEach((fieldName) => {
      const control = this.noticeForm.get(fieldName);
      if (control) {
        control.reset();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  initializeFormListeners(): void {
    const msgCtrl = this.noticeForm.get(
      'noticeMessageOptionId'
    ) as FormControl | null;
    const typeCtrl = this.noticeForm.get('noticeType') as FormControl | null;

    runInInjectionContext(this.injector, () => {
      this.formValueChangesSignal = toSignal(this.noticeForm.valueChanges, { initialValue: this.noticeForm.value });
      
      effect(() => {
        const formValue = this.formValueChangesSignal();
        if (formValue && !this.isFirstSelection()) {
          this._formModified.set(true);
          this._isCraeteDisabled.set(true);
          this._isTestExported.set(false);
        }
      });

      if (msgCtrl) {
        this.msgCtrlSignal = toSignal(msgCtrl.valueChanges, { initialValue: msgCtrl.value });
        effect(() => {
          const value = this.msgCtrlSignal();
          if (value !== null && value !== undefined) {
            this.updateNoticeMessageOptionbySelection(value);
          }
        });
      }
      
      if (typeCtrl) {
        this.typeCtrlSignal = toSignal(typeCtrl.valueChanges, { initialValue: typeCtrl.value });
        effect(() => {
          const value = this.typeCtrlSignal();
          if (value !== null && value !== undefined) {
            this.updateNoticeTypeSelection(value);
          }
        });
      }
    });
  }

  async loadData(filter: TicketFilterOptions) {
    try {
      // filter.actionsFilter!.statusID = [3]; //tickets in stutus open
      filter.violationDetailsFilter!.authorityID = [this.activatedAuthorityID()];

      const res = await this.ticketsService.getTickets(filter);
      if (res && res.list) {
        this._list.set(res.list.map((p) => new TicketNew(p)));
        this._total.set(res.list.length ? res.total : 0);
        this._count.set(res.count);
        this._ticketIDsList.set(this.list().map((ticket) => ticket.ticketID));
      }
    } catch (e) {
      console.error('Error loading data:', e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }
  async sendFormValue() {
    console.log(this.noticeForm);

    if (!this.skipFormValidation() && !this.noticeForm.valid) {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      return;
    }

    let raw = this.noticeForm.getRawValue();
    console.log(this.selecteNoticeType());

    this._ticketsFilters.set(Utils.mapNoticeFormToTicketFilterOptions(raw));
    // if (this.selecteNoticeType === noticeTypeOptions.PrintingHouse) {
    //   this.ticketsFilters = { ...this.ticketsFilters, pageSize: 1000 };
    // }
    this._skipFormValidation.set(false);

    if (this.noticeForm.valid) {
      const filter = this.ticketsFilters();
      if (filter) {
        await this.loadData(filter);
        if (this.count() == 0) {
          this.toaster.error(ErrorSuccessMessages.NO_TICKET_IN_MANA);
          return;
        }
        this.getStagingFile();
      } else {
        this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      }
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  updateNoticeMessageOptionbySelection(
    selectedValue: noticeMessageOptionsEnum
  ) {
    // Store the pending message type for confirmation
    this._pendingMessageType.set(selectedValue);
    
    if (this.formModified()) {
      this._isChangingNoticeModalOpen.set(true);
    } else {
      // If form is not modified, proceed directly with the change
      this.confirmMessageTypeChange(selectedValue);
    }
  }

  updateNoticeTypeSelection(selectedValue: noticeTypeOptions) {
    this._selecteNoticeType.set(selectedValue);
    this._selectedNoticeType.set(true);
  }

  confirmMessageTypeChange(newSelectedValue?: noticeMessageOptionsEnum): void {
    const messageTypeToConfirm = newSelectedValue || this._pendingMessageType();
    if (!messageTypeToConfirm) return;
    
    this.clearFormFields();
    this._skipFormValidation.set(true);
    this.updateSelectedMessageType(messageTypeToConfirm);
    this._formModified.set(false);
    this._pendingMessageType.set(null);
    setTimeout(() => {
      this.closeModal();
    }, 100);
  }

  updateSelectedMessageType(selectedValue: noticeMessageOptionsEnum): void {
    this._selectedMessageType.set(selectedValue);
  }

  createModalButtons(): ModalButton[] {
    return [
      { label: 'ביטול', action: () => this.closeModal(), buttonClass: 'outline-secondary-btn'},
      {
        label: 'אישור',
        action: () => {
          this.confirmMessageTypeChange();
        },
      },
    ];
  }

  closeModal() {
    // If modal is closed without confirmation, revert the select value
    const pendingType = this._pendingMessageType();
    if (pendingType !== null) {
      const msgCtrl = this.noticeForm.get('noticeMessageOptionId');
      if (msgCtrl) {
        // Revert to the current selected message type
        msgCtrl.setValue(this.selectedMessageType(), { emitEvent: false });
      }
      this._pendingMessageType.set(null);
    }
    this._isChangingNoticeModalOpen.set(false);
  }

  clearFormFields() {
    const dayToPayValue = this.noticeForm.get('dayToPay')?.value;
    
    Object.keys(this.noticeForm.controls).forEach((controlName) => {
      if (
        controlName !== 'noticeMessageOptionId' &&
        controlName !== 'authorityID' &&
        controlName !== 'sendingType' &&
        controlName !== 'isCombined'
      ) {
        this.noticeForm.get(controlName)?.reset();
      }
    });
    
    if (dayToPayValue !== null && dayToPayValue !== undefined) {
      this.noticeForm.get('dayToPay')?.setValue(dayToPayValue, { emitEvent: false });
    }
    
    this._isTestExported.set(false);
    this._formModified.set(false);
    this._skipFormValidation.set(true);
  }

  async getStagingFile() {
    this._isCraeteDisabled.set(true);
    try {
      const res = await this.noticesService.getStagingFile(this.ticketsFilters()!);
      if (res) {
        const blob = res.body;
        const contentDisposition = res.headers.get('Content-Disposition');

        let fileName = 'Staging_Manot_File.xlsx';
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, '');
          }
        }

        const file = new File([blob], fileName, { type: blob.type });
        Utils.saveFile(file);
        this._isTestExported.set(true);
        this._isCraeteDisabled.set(false);
      }
    } catch (e) {
      this._isCraeteDisabled.set(false);
      console.error('Error loading staging file:', e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async getFinalFile() {
    try {
      const selectedSendingType = this.noticeForm.get('sendingType')?.value;
      const isCombined = this.noticeForm.get('isCombined')?.value;
      const res =
        this.selecteNoticeType() === noticeTypeOptions.Local
          ? await this.noticesService.generateFinalFilePdf(
              this.ticketIDsList(),
              this.selectedMessageType()!,
              this.activatedAuthorityID()!,
              '', // userId - using empty string as placeholder
              this.selecteNoticeType(),
              selectedSendingType,
              isCombined
            )
          : await this.noticesService.getFinalFile(
              this.ticketsFilters()!,
              this.selectedMessageType()!,
              InterfaceTypes.Printing,
              this.selecteNoticeType(),
              selectedSendingType
            );

      if (this.selecteNoticeType() === noticeTypeOptions.PrintingHouse) {
        // txt
        const blob = res.body;
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = 'Final_Manot_File.txt';

        if (contentDisposition) {
          console.log(contentDisposition);
          const fileNameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );

          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, '');
          }
        }

        const file = new File([blob], fileName, { type: blob.type });
        Utils.saveFile(file);

        this.toaster.success(ErrorSuccessMessages.MANA_CREATED);
      } else {
        this.toaster.success(ErrorSuccessMessages.PRODUCTION_SEND_TO_MAIL);
      }
    } catch (e) {
      this._isTestExported.set(false);
      console.error('Error generating final file:', e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async getTimelineSettings() {
    try {
      const res = await this.timelineService.getTimelineSettings();
      if (res) {
        this._enforcmentRes.set(res);
      }
    } catch (e) {
      console.error('Error loading timeline settings:', e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  readonly isTypePreOrPayment = computed(() => {
    const messageType = this.selectedMessageType();
    return (
      messageType === noticeMessageOptionsEnum.PreNotice ||
      messageType === noticeMessageOptionsEnum.PaymentNotice
    );
  });

  readonly isNotTypePreOrPayment = computed(() => {
    const messageType = this.selectedMessageType();
    return [
      noticeMessageOptionsEnum.DemandNotice,
      noticeMessageOptionsEnum.Form3,
      noticeMessageOptionsEnum.DebtReminder,
    ].includes(messageType!);
  });

  readonly shouldShowNoticeTypeComponent = computed(() => {
    return this.isTypePreOrPayment() || this.isNotTypePreOrPayment();
  });

  readonly computedNotVisibleFields = computed(() => {
    return this.isTypePreOrPayment()
      ? this.notVisibleType()
      : this.notVisibleTypeDemand();
  });
}
