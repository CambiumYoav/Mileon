import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConstPath } from '../../../../constants/const_path';
import { ConstText } from '../../../../constants/const_text';
import {
  ModalButton,
  ModalButtonsText,
} from '../../../../constants/modalButtons';
import { ModalMessages } from '../../../../constants/modalMessages';
import { PermissionRoutes } from '../../../../constants/permissions.enum';
import { ROUTE_PATH } from '../../../../constants/routerPath';
import { PermissionService } from '../../../../services/permission.service';
import { RouterService } from '../../../../services/router.service';
import {
  FieldTypeEnum,
  FieldLengthEnum,
  Field,
  AdvancedForm,
} from '../../../../types/advanced-search/form-tab.model';
import {
  ActionModuleEnum,
  ModuleEnum,
} from '../../../../types/enum/moduleEnum';
import { PageTypeEnum } from '../../../../types/enum/pageTypesEnum';
import { ParkingPermitStatusEnum } from '../../../../types/enum/parkingPermitStatusEnums';
import { paymentSourceEnum } from '../../../../types/enum/paymentSourceEnum';
import { PermitByEnum } from '../../../../types/enum/permitByEnum';
import { IdValuePair } from '../../../../types/legalRequest/legal-request-file-type-response';
import { ParkingPermitTabs } from '../../../../types/parkingPermit/parking-permit-tabs.model';
import { ParkingPermitArea } from '../../../../types/parkingPermit/parkingPermitArea';
import { ParkingPermitDetails } from '../../../../types/parkingPermit/parkingPermitDetails';
import { ParkingPermitStatus } from '../../../../types/parkingPermit/parkingPermitStatus';

import { UploadedFile } from '../../../../types/uploadedFile';
import { BaseFormService } from '../../../shared/base-form/base-form.service';
import { ParkingPermitsService } from '../../parking-permits.service';
import { ReservedComment } from '../../../../types/reservedComment';
import { Comment } from '../../../../types/comment';
import ParkingPermits = ROUTE_PATH.ParkingPermits;
import { InputTextComponent } from '../../../shared/base/inputs/input-text/input-text.component';
import { RadioButtonComponent } from '../../../shared/base/radio-button/radio-button.component';
import { InputDateComponent } from '../../../shared/base/inputs/input-date/input-date.component';
import { SelectComponent } from '../../../shared/base/select/select.component';
import { InputPhoneComponent } from '../../../shared/base/inputs/input-phone/input-phone.component';
import { InputTimeComponent } from '../../../shared/base/inputs/input-time/input-time.component';
import { InputCheckboxComponent } from '../../../shared/base/inputs/input-checkbox/input-checkbox.component';
import { TextareaCommentsComponent } from '../../../shared/base/inputs/textarea-comments/textarea-comments.component';
import { AppModalComponent } from '../../../shared/app-modal/app-modal.component';
import { CORE_IMPORTS, SharedImports } from '../../../../shared/shared-modules';
import { UserTypePipe } from '../../../../pipes/user-type.pipe';
import { ButtonComponent } from '../../../shared/base/button/button.component';
import { ButtonLoaderDirective } from '../../../../directives/button-loader.directive';
import { FieldOption } from '../../../../types/infrastructure/InfrastructureTypes';
import { CheckboxComponent } from '../../../shared/base/checkbox/checkbox.component';
@Component({
  selector: 'app-parking-permit-info',
  imports: [
    CORE_IMPORTS,
    InputTextComponent,
    RadioButtonComponent,
    InputDateComponent,
    SelectComponent,
    InputPhoneComponent,
    InputTimeComponent,
    CheckboxComponent,
    TextareaCommentsComponent,
    AppModalComponent,
    UserTypePipe,
    ButtonComponent,
  ],
  templateUrl: './parking-permit-info.component.html',
  styleUrl: './parking-permit-info.component.scss',
})
export class ParkingPermitInfoComponent {
  // ---------------------------------------------------------------------------
  // enums / constants used in template
  // ---------------------------------------------------------------------------
  pageType: PageTypeEnum = PageTypeEnum.TO_EDIT;
  FieldTypeEnum = FieldTypeEnum;
  FieldLengthEnum = FieldLengthEnum;
  ActionModuleEnum = ActionModuleEnum;
  PageTypeEnum = PageTypeEnum;
  permitByEnum = PermitByEnum;

  AddressFields = ParkingPermitTabs.addressFields;
  EditableAddressFields = ParkingPermitTabs.EditAddressFelids;
  AdditionalCitizenFields = ParkingPermitTabs.additionalCitizenFields; // remove it
  permitArea = ParkingPermitTabs.permitArea;
  PermitBy = ParkingPermitTabs.PermitByFields;
  PermitAreas = ParkingPermitTabs.PermitAreaFields;
  permitDetails = ParkingPermitTabs.permitDetails;
  parkingPermitStatus = ParkingPermitTabs.parkingPermitStatusFields;

  ErrorMessage = '*לא תקין';
  // ---------------------------------------------------------------------------
  // Inputs (signals) instead of @Input
  // ---------------------------------------------------------------------------
  parkingPermit = input<ParkingPermitDetails | null>(null);

  parkingPermitForm = input<FormGroup | null>(null);
  authorityID = input<string | null>(null);

  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  ParkingPermitDetailsTabs!: AdvancedForm;
  parkingPermitDocumentTypes: IdValuePair[] = [];

  // Icons / consts
  editSvg = ConstPath.EDIT;
  calenderSvg = ConstPath.CELANDER;
  addCircle = ConstPath.ADD_CIRCLE;
  tickBox = ConstPath.TickBox;
  crossBox = ConstPath.CrossBox;
  documentCompletion = ConstPath.DOCUMENT_COMPLETION;
  days = ConstText.Days;

  citizenPhonesArray!: FormArray;
  reservedRemarks: ReservedComment[] = [];
  areasFormArray!: FormArray;
  hasInitialized = false;
  isReturningResidentChecked = false;
  filesToUpload: UploadedFile[] = [];

  isModalOpen = false;
  modalTitle = '';
  modalButtons: ModalButton[] = [];
  modalMessage = '';
  isSaveLoading = false;

  saveOrUpdatePermission = true;
  updateStatusPermission = true;
  isAllDayChecked = false;

  newComment: Comment = { text: '', reservedCommentsIDs: [] };

  hasForm = computed(() => {
    const fg = this.parkingPermitForm();
    return !!fg && Object.keys(fg.controls).length > 0;
  });

  // ---------------------------------------------------------------------------
  // DI – inject() (no constructor params needed)
  // ---------------------------------------------------------------------------
  private readonly formBuilder = inject(FormBuilder);
  private readonly parkingPermitService = inject(ParkingPermitsService);
  private readonly routerService = inject(RouterService);
  private readonly formService = inject(BaseFormService);
  private readonly router = inject(Router);
  private readonly permissionsService = inject(PermissionService);

  constructor() {
    // 1) Form wiring when parkingPermitForm (and authorityID) arrive
    effect(
      () => {
        const form = this.parkingPermitForm();
        const authorityID = this.authorityID();

        if (!form || this.hasInitialized) return;

        // add permitByArray FormArray
        form.addControl('permitByArray', this.formBuilder.array([]));
        this.areasFormArray = form.get('permitByArray') as FormArray;

        const citizenGroup = form.get('citizen') as FormGroup | null;
        if (citizenGroup) {
          this.citizenPhonesArray = citizenGroup.get(
            'citizenPhones'
          ) as FormArray;
        }

        // set authorityID only on create
        if (this.pageType === PageTypeEnum.TO_CREATE && authorityID) {
          form.get('authorityID')?.setValue(authorityID);
        }

        this.hasInitialized = true;
      },
      { allowSignalWrites: true }
    );

    // 2) React to parkingPermit changes (set returning resident, areas, allDay)
    effect(
      () => {
        const permit = this.parkingPermit();
        if (!permit || !this.areasFormArray) return;

        // returning resident checkbox
        this.onCheckboxOfIsReturningResidentChange(
          permit.citizen?.isReturningResident ?? false
        );

        // areas / streets
        this.addStreetsAndAreasToFormArray(
          permit.parkingPermitAreas,
          PermitByEnum.AREAS
        );

        // all-day flag
        this.isAllDayChecked =
          permit.fromTime === '00:00:00' && permit.toTime === '00:00:00';
      },
      { allowSignalWrites: true }
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle replacement for ngOnInit
  // ---------------------------------------------------------------------------
  ngOnInit(): void {
    this.saveOrUpdatePermission = this.permissionsService.checkUserPermission(
      PermissionRoutes.PARKING_PERMIT_CREATE_UPDATE
    );
    this.updateStatusPermission = this.permissionsService.checkUserPermission(
      PermissionRoutes.PARKING_PERMIT_UPDATE_STATUS
    );

    this.ParkingPermitDetailsTabs =
      this.pageType === PageTypeEnum.TO_VIEW
        ? ParkingPermitTabs.ParkingPermitDetailsTabs
        : ParkingPermitTabs.EditParkingPermitDetailsTabs;

    console.log('form controls:', this.parkingPermitForm()?.controls);
    console.log('ParkingPermitDetailsTabs:', this.ParkingPermitDetailsTabs);
    console.log(
      'rows:',
      this.ParkingPermitDetailsTabs?.tabs[0].rows.map((r) => ({
        rowName: r.name,
        fields: r.group.map((f) => f.name),
      }))
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private addStreetsAndAreasToFormArray(
    permitAreaOrStreet: ParkingPermitArea[] | null | undefined,
    permitBy: PermitByEnum
  ) {
    if (!permitAreaOrStreet || !this.areasFormArray) return;

    for (const item of permitAreaOrStreet) {
      const fg = this.formService.buildNestedForm(item) as FormGroup;
      fg.addControl('permitBy', this.formBuilder.control(permitBy));
      this.areasFormArray.push(fg);
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onCheckboxOfIsReturningResidentChange(yesOrNo: boolean) {
    this.isReturningResidentChecked = yesOrNo;
    const form = this.parkingPermitForm();
    form
      ?.get('citizen')
      ?.get('isReturningResident')
      ?.setValue(this.isReturningResidentChecked);
  }

  async saveParkingPermitDetails() {
    const form = this.parkingPermitForm();
    console.log(form);
    if (!form) return;

    this.isSaveLoading = true;

    let parkingPermitValues: ParkingPermitDetails = form.value;

    if (this.pageType === PageTypeEnum.TO_CREATE) {
      parkingPermitValues.statusId = ParkingPermitStatusEnum.AwaitingPayment;
      parkingPermitValues.requestSourceID = paymentSourceEnum.ManagementSystem;
    }

    this.handleParkingPermitFiles(parkingPermitValues);
    this.addNewRemark(parkingPermitValues);

    const response: any = await this.parkingPermitService.updateParkingPermit(
      parkingPermitValues
    );

    const result = response?.body ?? response;
    if (result) {
      this.isSaveLoading = false;
      this.routerService.navigateToUrl([ROUTE_PATH.ParkingPermits.Home], true);
    }
  }

  private handleParkingPermitFiles(parkingPermitToSave: ParkingPermitDetails) {
    if (!this.filesToUpload.length) return;

    parkingPermitToSave.parkingPermitFiles = [];
    this.filesToUpload.forEach((uploadedFile) => {
      parkingPermitToSave.parkingPermitFiles!.push({
        parkingPermitFilesTypeID: uploadedFile.documentType,
        file: uploadedFile.file,
      });
    });
  }

  private addNewRemark(parkingPermitDetails: ParkingPermitDetails) {
    if (!this.newComment.text) return;

    if (!parkingPermitDetails.parkingPermitRemarks) {
      parkingPermitDetails.parkingPermitRemarks = [];
    }

    parkingPermitDetails.parkingPermitRemarks.push({
      content: this.newComment.text,
      creationDate: new Date(),
      userID: this.permissionsService.userId(),
      reservedRemarks: this.newComment.reservedCommentsIDs.map((id) => ({
        id,
      })),
    });
  }

  // ---------------------------------------------------------------------------
  // Status changes + modals
  // ---------------------------------------------------------------------------

  approveParkingPermit() {
    this.initModal(ModalMessages.ARE_YOU_SURE_YOU_WANT_TO_APPROVE, [
      { label: ModalButtonsText.Cancel, action: () => this.closeModal() },
      {
        label: ModalButtonsText.Confirm,
        action: () => this.approveParkingPermitRequest(),
      },
    ]);
    this.isModalOpen = true;
  }

  approveParkingPermitRequest() {
    const permit = this.parkingPermit();
    if (!permit) return;

    const parkingPermitStatus: ParkingPermitStatus = {
      parkingPermitID: permit.parkingPermitID,
      statusID: ParkingPermitStatusEnum.Approved,
    };

    this.parkingPermitService
      .updateParkingPermitStatus(parkingPermitStatus)
      .then((res) => {
        if (
          res.parkingPermitStatus.statusId ===
          ParkingPermitStatusEnum.AwaitingPayment
        ) {
          const buttons: ModalButton[] = [
            { label: ModalButtonsText.Cancel, action: () => this.closeModal() },
            {
              label: ModalButtonsText.Confirm,
              action: () => this.navigateToPaymentPage(),
            },
          ];
          this.initModal(
            ModalMessages.ARE_YOU_WANT_TO_MOVE_PAYMENT_PAGE,
            buttons
          );
          this.isModalOpen = true;
        }
      });
  }

  initModal(title: string, buttons: ModalButton[]) {
    this.modalTitle = title;
    this.modalButtons = buttons;
  }

  declineParkingPermit() {
    this.initModal(ModalMessages.ARE_YOU_SURE_YOU_WANT_TO_DENY, [
      { label: ModalButtonsText.Cancel, action: () => this.closeModal() },
      {
        label: ModalButtonsText.Confirm,
        action: () => this.declineParkingPermitRequest(),
      },
    ]);
    this.isModalOpen = true;
  }

  moveToDocumentCompletion() {
    this.initModal(
      ModalMessages.ARE_YOU_SURE_YOU_WANT_TO_MOVE_DOCUMENT_COMPLETION,
      [
        { label: ModalButtonsText.Cancel, action: () => this.closeModal() },
        {
          label: ModalButtonsText.Confirm,
          action: () => this.moveToDocumentCompletionRequest(),
        },
      ]
    );
    this.isModalOpen = true;
  }

  moveToDocumentCompletionRequest() {
    const permit = this.parkingPermit();
    if (!permit) return;

    const parkingPermitStatus: ParkingPermitStatus = {
      parkingPermitID: permit.parkingPermitID,
      statusID: ParkingPermitStatusEnum.AwaitingFiles,
    };
    this.parkingPermitService
      .updateParkingPermitStatus(parkingPermitStatus)
      .then(() => this.closeModal());
  }

  declineParkingPermitRequest() {
    const permit = this.parkingPermit();
    if (!permit) return;

    const parkingPermitStatus: ParkingPermitStatus = {
      parkingPermitID: permit.parkingPermitID,
      statusID: ParkingPermitStatusEnum.Denied,
    };
    this.parkingPermitService
      .updateParkingPermitStatus(parkingPermitStatus)
      .then(() => this.closeModal());
  }

  navigateToPaymentPage() {
    const permit = this.parkingPermit();
    if (!permit) return;

    const data: { records?: any[]; module: ModuleEnum; recordId?: string } = {
      records: [permit],
      module: ModuleEnum.ParkingPermitsModule,
    };

    const role = this.permissionsService.role;
    this.router
      .navigate([`main/${role}/payment`], {
        state: { data },
      })
      .catch((error) => {
        console.error('Navigation error:', error);
      });
  }

  trackByIndex = (index: number, _item: any) => index;

  getSelectedPermitByValue(fg: AbstractControl) {
    return fg.get('permitBy')?.value ?? null;
  }

  isDayOn(flag: number): boolean {
    const permit = this.parkingPermit();
    const mask = permit?.activeDays ?? 0;
    return (mask & flag) === flag;
  }

  transformRadioOptions(options: FieldOption[] | undefined): any[] {
    if (!options || !Array.isArray(options)) return [];
    return options.map((option) => ({
      value: option.value,
      label: option.display,
    }));
  }

  getDetailValue(detail: Field): any {
    const permit = this.parkingPermit(); // or this.parkingPermit if not signal
    if (!permit) return null;
    return (permit as any)[detail.name]
      ? (permit as any)[detail.name]
      : 'לא נמצא';
  }
}
