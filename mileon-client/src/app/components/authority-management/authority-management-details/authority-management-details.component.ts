import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  signal,
  computed,
  effect,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { SessionService } from '../../../services/session.service';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { AuthorityForm } from '../../../types/management/management-form-fileds';
import { SharedDataService } from '../../../services/shared-data.service';
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { AuthorityManagementService } from '../authority-management.service';
import { AuthorityService } from '../../../services/authority.service ';
import { AuthorityManagementDymanicFormComponent } from '../authority-management-dymanic-form/authority-management-dymanic-form.component';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityManagementUtils } from '../../../utils/authorityManagment';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-authority-management-details',
  templateUrl: './authority-management-details.component.html',
  styleUrls: ['./authority-management-details.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AuthorityManagementDymanicFormComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
})
export class AuthorityManagementDetailsComponent implements OnInit {
  readonly title = TitlesEnum.AuthorityDetails;
  readonly titleCustomer = TitlesEnum.AuthorityCustomerDetails;

  private readonly _form = signal<any>(null);
  private readonly _customerForm = signal<any>(null);
  private readonly _isSubmit = signal<boolean>(false);
  private readonly _formResults = signal<any[]>([]);
  private readonly _formRecreationTrigger = signal<number>(0);
  private readonly _isModalOpen = signal<boolean>(false);
  private readonly _authorityDetails = signal<any[] | null>([]);
  private readonly _createdId = signal<string>('');
  private readonly _saveSuccess = signal<boolean>(false);

  readonly form = computed(() => this._form());
  readonly customerForm = computed(() => this._customerForm());
  readonly isSubmit = computed(() => this._isSubmit());
  readonly formResults = computed(() => this._formResults());
  readonly formRecreationTrigger = computed(() => this._formRecreationTrigger());
  readonly isModalOpen = computed(() => this._isModalOpen());
  readonly authorityDetails = computed(() => this._authorityDetails());
  readonly createdId = computed(() => this._createdId());
  readonly saveSuccess = computed(() => this._saveSuccess());

  readonly expectedForms = 2;

  @Output() updateAuthority = new EventEmitter<boolean>();
  @ViewChild('form1') formComponent1!: AuthorityManagementDymanicFormComponent;
  @ViewChild('form2') formComponent2!: AuthorityManagementDymanicFormComponent;

  private readonly sessionService = inject(SessionService);
  private readonly sharedDataService = inject(SharedDataService);
  private readonly modeDetectionService = inject(ModeDetectionService);
  private readonly authorityManagementService = inject(AuthorityManagementService);
  private readonly authorityService = inject(AuthorityService);
  private readonly toaster = inject(ToastrService);

  constructor() {
    const form = new AuthorityForm();
    this._form.set(form.AuthorityFields);
    this._customerForm.set(form.CustomerAuthorityFields);

    // Initialize effects in constructor (injection context)
    // Use effect to reactively respond to authority changes
    effect(() => {
      const authorityID = this.sharedDataService.getCurrentCreatedAuthority();
      if (authorityID && !this.isEditMode) {
        this.getAuthorityData(authorityID);
      }
    });

    // Handle edit mode with reactive authority changes
    if (this.isEditMode) {
      this.sessionService.remove('authorityData');
      effect(() => {
        const authorityID = this.authorityService.authorityId();
        if (authorityID) {
          this.getAuthorityData(authorityID);
        }
      });
    }
  }

  ngOnInit() {
    this.modeDetectionService.detectAndSetMode(
      'AuthorityManagementDetailsComponent'
    );
  }

  private patchDynamicForm(formConfig: any[], data: any) {
    AuthorityManagementUtils.patchDynamicForm(formConfig, data);
    // Trigger form recreation
    this._formRecreationTrigger.update(trigger => trigger + 1);
  }

  get isEditMode(): boolean {
    return this.modeDetectionService.getCurrentMode();
  }

  async getAuthorityData(authorityID: string) {
    try {
      const res =
        await this.authorityManagementService.getAuthorityWithCustomer(
          authorityID
        );
      this.patchDynamicForm(this.form(), res.authority);
      this.patchDynamicForm(this.customerForm(), res.customer);
    } catch (e) {
      console.error('Error fetching authority data:', e);
    }
  }
  async createAndUpdateAuthorityWithCustomer() {
    // Create or update authority with customer
    try {
      const res =
        await this.authorityManagementService.createAndUpdateAuthorityWithCustomer(
          this.authorityDetails()!
        );
      if (res) {
        if (!this.isEditMode) {
          this._createdId.set(res.authorityId);
          this.sharedDataService.setCreatedAuthority(this.createdId());
          this.sharedDataService.setAuthorityCreationStatus(true);
        } else {
          this.toaster.success(
            ErrorSuccessMessages.SETTINGS_UPDATED_SUCCESSFULY
          );
        }
        this._saveSuccess.set(true); // Set save success flag
      }
    } catch (e) {
      this.sharedDataService.setAuthorityCreationStatus(false);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(e);
    }
  }

  navigateToNextForm() {
    const currentData = {
      authority: this.form().value,
      customer: this.customerForm().value,
    };
    this.sessionService.set('authorityEditData', currentData);

    this.modeDetectionService.navigateToNext(
      `${RP.Management.TextTemplates}/text`
    );
  }

  checkIfFormIsValid(event: any): void {
    // Use the explicit isValid if available, otherwise check status
    const isFormValid =
      event.isValid !== undefined
        ? event.isValid
        : event.form.status === 'VALID';

    const formData = {
      form: event.form.value,
      isValid: isFormValid,
      title: event.formTitle,
    };
    
    this._formResults.update(results => [...results, formData]);

    // Check if all forms have responded
    if (this.formResults().length === this.expectedForms) {
      this.processAllResults();
    }
  }

  private async processAllResults() {
    const allValid = this.formResults().every((result) => result.isValid);

    if (allValid) {
      const rawAuthorityData = this.formResults()[0].form;
      const rawCustomerData = this.formResults()[1].form;

      if (this.isEditMode) {
        const updateData = AuthorityManagementUtils.createUpdateDTO(
          rawAuthorityData,
          rawCustomerData,
          this.authorityService.authorityId()!
        );
        this._authorityDetails.set(updateData);
        this.sessionService.set('authorityData', updateData);
      } else if (!this.isEditMode && this.authorityService.authorityId()) {
        const authorityID = this.sharedDataService.getCurrentCreatedAuthority();

        const updateData = AuthorityManagementUtils.createUpdateDTO(
          rawAuthorityData,
          rawCustomerData,
          authorityID!
        );
        this._authorityDetails.set(updateData);

        await this.createAndUpdateAuthorityWithCustomer();
      } else {
        const createData = AuthorityManagementUtils.createCreateDTO(
          rawAuthorityData,
          rawCustomerData
        );
        this._authorityDetails.set(createData);
        this.sessionService.set('authorityData', createData);
        await this.createAndUpdateAuthorityWithCustomer();
      }
      if (this.isEditMode) {
        //call  api and send the data
        await this.createAndUpdateAuthorityWithCustomer();
      } else {
        if (this.saveSuccess()) {
          // Reset state BEFORE navigation
          this.resetSubmissionState();
          this.navigateToNextForm();
        }
      }
    } else {
      // Reset only form results to allow resubmission
      this.resetSubmissionState();
    }
  }

  private resetSubmissionState(): void {
    this._isSubmit.set(false);
    this._formResults.set([]);
  }

  submitForm() {
    this.formComponent1.onSubmit();
    this.formComponent2.onSubmit();
    this._formResults.set([]); // Reset results
  }
  
  openModal() {
    this._isModalOpen.set(true);
  }
  
  closeModal() {
    this._isModalOpen.set(false);
  }
}
