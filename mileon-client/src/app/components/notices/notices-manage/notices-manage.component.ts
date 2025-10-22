import { Component, OnDestroy, OnInit, signal, computed, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import {
  NoticeForm,
  noticeValidation,
} from '../../../types/notices/notice-form';
import {
  noticeSearchFields,
} from '../../../types/notices/notice-form-fileds';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { ModuleEnum } from '../../../types/enum/moduleEnum';
import { NoticesService } from '../notices.service';
import { AuthorityService } from '../../../services/authority.service ';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { Utils } from '../../../utils/utils';
import { Buttons as ActionButtonsEnum } from '../../../constants/buttonEnum';
import { FileTypeExtension } from '../../../types/enum/fileType.enum';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import {
  InterfaceTypesHebrew,
  PostTypeHebrewEnum,
  ProductionStatusEnum,
  UploadActionTypes,
} from '../../../types/enum/noticesInterfacesEnum';
import { FILE_CONFIG } from './notice-manage-config';
import { NoticesFormComponent } from '../notices-form/notices-form.component';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { MatDialog } from '@angular/material/dialog';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { NoticesTableComponent } from '../notices-table/notices-table.component';
import { noticesUploadFields } from '../../../types/notices/notice-form-fileds';

@Component({
  selector: 'app-notices-manage',
  templateUrl: './notices-manage.component.html',
  styleUrls: ['./notices-manage.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    SelectComponent,
    InputDateComponent,
    ButtonComponent,
    NoticesTableComponent
]
})
export class NoticesManageComponent implements OnInit, OnDestroy {
  readonly Buttons = ActionButtonsEnum;
  readonly title = signal<string>(TitlesEnum.ManotMangment);
  readonly moduleEnum = ModuleEnum;
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly noticeSearchFields = noticeSearchFields;

  private readonly destroy$ = new Subject<void>();

  private readonly _activatedAuthorityID = signal<string>('');
  private readonly _productionTicketsFilter = signal<TicketFilterOptions | null>(null);
  private readonly _productionTickets = signal<any[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _count = signal<number>(0);
  private readonly _searchText = signal<string>('');
  private readonly _list = signal<any[]>([]);
  private readonly _isManaSelected = signal<boolean>(false);
  private readonly _selectedManaID = signal<string>('');
  private readonly _selectedMana = signal<any>(null);
  private readonly _selectedType = signal<string>('');
  private readonly _dialogData = signal<DynamicRow[]>([]);
  private readonly _isRegisteredMail = signal<boolean>(false);

  readonly activatedAuthorityID = computed(() => this._activatedAuthorityID());
  readonly productionTicketsFilter = computed(() => this._productionTicketsFilter());
  readonly productionTickets = computed(() => this._productionTickets());
  readonly total = computed(() => this._total());
  readonly count = computed(() => this._count());
  readonly searchText = computed(() => this._searchText());
  readonly list = computed(() => this._list());
  readonly isManaSelected = computed(() => this._isManaSelected());
  readonly selectedManaID = computed(() => this._selectedManaID());
  readonly selectedMana = computed(() => this._selectedMana());
  readonly selectedType = computed(() => this._selectedType());
  readonly dialogData = computed(() => this._dialogData());
  readonly isRegisteredMail = computed(() => this._isRegisteredMail());

  noticeForm!: FormGroup;

  private readonly baseFormService = inject(BaseFormService);
  private readonly toaster = inject(ToastrService);
  private readonly noticesService = inject(NoticesService);
  private readonly authorityService = inject(AuthorityService);
  private readonly dialog = inject(MatDialog);

  private readonly authorityIDSignal = toSignal(this.authorityService.authorityId$, { initialValue: '' });

  constructor() {
    this.noticeForm = this.baseFormService.createFormGroup(NoticeForm);
    this.baseFormService.setValidations(this.noticeForm, noticeValidation);

    effect(() => {
      const authorityID = this.authorityIDSignal();
      if (authorityID && authorityID !== '') {
        this._activatedAuthorityID.set(authorityID);
        this.noticeForm.patchValue({ authorityID: authorityID });
      }
    });
  }

  ngOnInit(): void {
    this.authorityService.setMunicipalsToNationalRegional();
    // Initialize dialog data for upload dialog
    this._dialogData.set(noticesUploadFields);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFormValues() {
    const filter = Utils.mapNoticeFormToProductionTicketFilterOptions(this.noticeForm.value);
    this._productionTicketsFilter.set(filter);
    // console.log(this.productionTicketsFilter());
  }

  search() {
    this.getFormValues();
    const filter = this.productionTicketsFilter();
    if (filter) {
      this.loadData(filter);
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.noticeForm.get(fieldName);
    return control ? (control.valid || control.disabled) : true;
  }

  async loadData(filter: any) {
    try {
      filter.pageSize = 50;
      const res = await this.noticesService.getManot(filter);
      if (res && res.list) {
        const processedTickets = res.list.map((item: any) => {
          const toDate = res.toDate;
          const fromDate = res.fromDate;
          item.isDisabled = item.isDisabled ? 'נכים' : 'הכל';
          item.displayInterfaceType = InterfaceTypesHebrew[item.interfaceType as keyof typeof InterfaceTypesHebrew];   
          item.sendStatusDisplay = Utils.guidEq(
            item.sendStatusId,
            ProductionStatusEnum.Sent
          );

          return {
            ...item,
            toDate,
            fromDate,
          };
        });
        
        this._productionTickets.set(processedTickets);
        this._total.set(res.total);
        this._count.set(res.count);
      }
    } catch (e) {
      console.error('Error loading data:', e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async restoreMana(): Promise<void> {
    try {
      const config = FILE_CONFIG[this.selectedType() as keyof typeof FILE_CONFIG];
      if (!config) {
        console.warn(`Unsupported type: ${this.selectedType()}`);
        return;
      }

      const res =
        this.selectedType() === 'Printing'
          ? await this.noticesService.restoreMana(this.selectedManaID())
          : await this.noticesService.restoreManaLocal(
              this.activatedAuthorityID(),
              this.selectedManaID()
            );

      if (res) {
        this.saveFile(res, config.fileName, config.fileType);
      }
    } catch (error) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async getMana() {
    try {
      const res = await this.noticesService.getMana(this.selectedManaID());

      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
      const fileName = `mana-${currentDate}.xlsx`;
      const file = new File([res], fileName, {
        type: FileTypeExtension.XLSX,
      });
      Utils.saveFile(file);
    } catch (e) {}
  }

  private saveFile(data: any, fileName: string, fileType: string): void {
    const file = new File([data], fileName, { type: fileType });
    Utils.saveFile(file);
  }

  openDialog(isPost: boolean = false) {
    let dialogComponent = NoticesFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      dialogData = dialogData.map((row) => {
        row.row = row.row.map((field) => {
          if (field.name === 'authorityID') {
            return { ...field, value: this.activatedAuthorityID() };
          }
          if (field.name === 'manaId') {
            return { ...field, value: this.selectedManaID() };
          }
          if (field.name === 'actionType') {
            return {
              ...field,
              value: !isPost
                ? UploadActionTypes.PostApprove
                : UploadActionTypes.CopyTicket,
            };
          }
          return field;
        });
        return row;
      });
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          form: dialogData,
          title: !isPost ? 'העלאת אישור משלוח ' : 'העלאת העתק דוח',
        },
      });
      
      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(async (result) => {
        if (result) {
          await this.uploadFile(result.form);
        }
      });
    }
  }

  onManaSelected(manaData: any): void {
    this._selectedMana.set(manaData);
    this._selectedManaID.set(manaData.manaId);
    this._selectedType.set(manaData.interfaceType);
    this._isRegisteredMail.set(manaData.postType === PostTypeHebrewEnum.RegisteredMail);
    this._isManaSelected.set(true);
  }

  async uploadFile(file: any) {
    try {
      const res = await this.noticesService.uploadFile(file);
      if (res) {
        this.dialog.closeAll();
        this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
      }
    } catch (e) {
      console.error('Error uploading file:', e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }
}
