import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  OnInit,
  Output,
  inject,
  input,
  effect,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParkingPermitDynamicFormUtil } from './parking-permit-dynamic-form.util';
import { ConstPath } from '../../../constants/const_path';
import { TimeEnum } from '../../../types/enum/dateTypeEnum';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { WeekDays } from '../../../types/enum/weekDaysEnum';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { DF, DynamicFormsUtils } from '../../../utils/dynamicForms';
import { Utils } from '../../../utils/utils';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { InputNumberComponent } from '../../shared/base/inputs/input-number/input-number.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { RadioButtonComponent } from '../../shared/base/radio-button/radio-button.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InputCheckboxOptionGroupComponent } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { InputCheckboxComponent } from '../../shared/base/inputs/input-checkbox/input-checkbox.component';
import { CORE_IMPORTS } from '../../../shared/shared-modules';
import { InputTimeComponent } from '../../shared/base/inputs/input-time/input-time.component';

@Component({
  selector: 'app-parking-permits-dynamic-form',
  standalone: true,
  imports: [
    CORE_IMPORTS,
    ReactiveFormsModule,
    InputTextComponent,
    InputNumberComponent,
    InputCheckboxComponent,
    InputDateComponent,
    RadioButtonComponent,
    SelectComponent,
    InputTimeComponent,
    InputCheckboxOptionGroupComponent,
  ],
  templateUrl: './parking-permits-dynamic-form.component.html',
  styleUrls: ['./parking-permits-dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParkingPermitsDynamicFormComponent implements OnInit {
  // ---------------------------------------------------------------------------
  // Signal Inputs
  // ---------------------------------------------------------------------------
  title = input<string>('');
  rows = input<DynamicRow[]>([]);
  triggerFormRecreation = input<number>(0);
  authorityID = input<string>('');
  isParkingPermitCreate = input<boolean>(false);
  allAreas = input<any[] | null>(null);

  @Output() formSubmitted = new EventEmitter<{
    form: any;
    isValid: boolean;
    status: string;
    formTitle: string;
  }>();

  // ---------------------------------------------------------------------------
  // DI
  // ---------------------------------------------------------------------------
  private readonly fb = inject(FormBuilder);
  private readonly toaster = inject(ToastrService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  Icons = ConstPath;

  isSubmitted = false;
  isDisabled = false;
  dynamicForm!: FormGroup;

  /** used to avoid running effects before initial init is complete */
  private initialized = false;

  get activeDays(): number {
    return this.dynamicForm?.get('activeDays')?.value ?? 0;
  }

  // ---------------------------------------------------------------------------
  // Constructor: set up effects reacting to signal inputs
  // ---------------------------------------------------------------------------
  constructor() {
    // rows + triggerFormRecreation → rebuild form (after initial init)
    effect(
      () => {
        const rows = this.rows();
        const trigger = this.triggerFormRecreation();

        if (!this.initialized) return;
        if (!rows || !rows.length) return;

        this.rebuildAndWireForm();
      },
      { allowSignalWrites: true }
    );

    // authorityID changes → patch authorityID (after init)
    effect(
      () => {
        const authorityId = this.authorityID();
        if (!this.initialized) return;
        if (!authorityId) return;
        if (!this.dynamicForm) return;

        this.patchAuthorityID(authorityId);
      },
      { allowSignalWrites: true }
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  ngOnInit(): void {
    // build once with initial inputs
    this.createForm();
    const authId = this.authorityID();
    if (authId) {
      this.patchAuthorityID(authId);
    }

    if (!this.isParkingPermitCreate()) {
      this.setupHoursBlock();

      ParkingPermitDynamicFormUtil.setParkingTime(
        this.dynamicForm,
        this.rows(),
        this.isDisabled
      );

      // duration mode (days/months/years/dates)
      ParkingPermitDynamicFormUtil.setupPermitDurationModeHandlers(
        this.dynamicForm,
        this.rows(),
        this.destroyRef
      );

      // disable authorityPermitTypeID in config
      DF.setDisabled(
        this.dynamicForm,
        this.rows(),
        'authorityPermitTypeID',
        true
      );
    } else {
      this.setupIdPassportValidation();
      this.setupPermitTypeBlock();
    }

    this.initialized = true;
  }

  // ---------------------------------------------------------------------------
  // Form build / rebuild
  // ---------------------------------------------------------------------------

  private createForm(): void {
    const rows = this.rows();

    const formGroup = rows.reduce((group, dynamicRow) => {
      dynamicRow.row.forEach((field: any) => {
        group[field.name] = this.createFieldControl(field);
      });
      return group;
    }, {} as { [key: string]: any });

    this.dynamicForm = this.fb.group(formGroup);
  }

  /** full rebuild when rows / trigger / authorityID change AFTER init */
  private rebuildAndWireForm(): void {
    this.createForm();
    const authId = this.authorityID();
    if (authId) {
      this.patchAuthorityID(authId);
    }

    if (this.isParkingPermitCreate()) {
      this.setupIdPassportValidation();
      this.setupPermitTypeBlock();
    } else {
      ParkingPermitDynamicFormUtil.setParkingTime(
        this.dynamicForm,
        this.rows(),
        this.isDisabled
      );

      const allDayCtrl = this.dynamicForm.get('allDay');
      if (allDayCtrl) {
        allDayCtrl.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() =>
            ParkingPermitDynamicFormUtil.setParkingTime(
              this.dynamicForm,
              this.rows(),
              this.isDisabled
            )
          );
      }

      const casualCtrl = DynamicFormsUtils.findControlByName(
        this.dynamicForm,
        'casualParkingSlot'
      );
      if (casualCtrl) {
        casualCtrl.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() =>
            ParkingPermitDynamicFormUtil.setParkingTime(
              this.dynamicForm,
              this.rows(),
              this.isDisabled
            )
          );
      }

      ParkingPermitDynamicFormUtil.setupPermitDurationModeHandlers(
        this.dynamicForm,
        this.rows(),
        this.destroyRef
      );
      DynamicFormsUtils.setConfigDisabled(
        'authorityPermitTypeID',
        true,
        this.rows()
      );
    }

    this.cdr.markForCheck();
  }

  private createFieldControl(field: any): any {
    const validations = DynamicFormsUtils.getFieldValidations(field);

    if (this.isFromToField(field)) {
      return this.createFromToGroup(field, validations);
    }

    return [field.value ?? '', validations];
  }

  private isFromToField(field: any): boolean {
    return field.type === 'fromTo' && field.fields?.length > 0;
  }

  private createFromToGroup(field: any, validations: ValidatorFn[]): any {
    const timeValidators = [
      ...validations,
      DynamicFormsUtils.timeFormatValidator(),
    ];

    const group = this.fb.group({
      fromTime: [field.fields[0]?.value || '', timeValidators],
      toTime: [
        field.fields[1]?.value || '',
        [...timeValidators, ParkingPermitDynamicFormUtil.timeRangeValidator()],
      ],
    });

    group
      .get('fromTime')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        group.get('toTime')?.updateValueAndValidity({ emitEvent: false });
      });

    return group;
  }

  // ---------------------------------------------------------------------------
  // Validation helpers / selections
  // ---------------------------------------------------------------------------

  isFieldValid(name: string): boolean {
    const control = this.dynamicForm.get(name);
    if (!control || control.disabled) return true;

    if (name === 'activeDays') {
      const value = control.value;
      const isValid = value !== null && value !== 0 && value !== '';
      return control.touched ? isValid : true;
    }

    return control.touched ? control.valid : true;
  }

  patchAuthorityID(selectedValues: any): void {
    if (selectedValues === null || selectedValues === undefined) return;
    if (!this.dynamicForm) return;
    this.dynamicForm.patchValue({ authorityID: selectedValues });
  }

  onSelectionChange(selectedValues: any, fieldName: string): void {
    if (fieldName === 'activeDays') {
      const arr = Array.isArray(selectedValues)
        ? selectedValues
        : String(selectedValues).split(',');

      const mask = arr
        .filter((v) => v !== '' && v !== null && v !== undefined)
        .map((v) => +v)
        .reduce((acc, flag) => acc | flag, 0);

      const ctrl = this.dynamicForm.get('activeDays');
      ctrl?.setValue(mask, { emitEvent: true });
      ctrl?.markAsTouched();
      ctrl?.updateValueAndValidity();
      return;
    }

    if (fieldName !== 'allDay') {
      this.dynamicForm.patchValue({
        [fieldName]: Array.isArray(selectedValues)
          ? selectedValues.join(',')
          : selectedValues,
      });
      return;
    }

    const isAllDay = Array.isArray(selectedValues)
      ? selectedValues.includes(true) ||
        selectedValues.includes(1) ||
        selectedValues.includes('1')
      : DF.coerceBool(selectedValues);

    this.dynamicForm.patchValue({ allDay: isAllDay }, { emitEvent: false });
    ParkingPermitDynamicFormUtil.setAllDay(isAllDay, this.dynamicForm);
  }

  getNestedFieldErrors(groupName: string, fieldName: string) {
    DynamicFormsUtils.getNestedFieldErrors(
      groupName,
      fieldName,
      this.dynamicForm
    );
  }

  isChecked(flag: number) {
    return DF.maskHas(this.activeDays, flag);
  }

  toggleDay(flag: number, checked: boolean) {
    let mask = this.activeDays;
    mask = checked ? DF.maskAdd(mask, flag) : DF.maskRemove(mask, flag);
    this.dynamicForm.get('activeDays')?.setValue(mask, { emitEvent: false });
  }

  isAllChecked(): boolean {
    return (this.activeDays & WeekDays.All) === WeekDays.All;
  }

  // ---------------------------------------------------------------------------
  // Payload builders
  // ---------------------------------------------------------------------------

  private applyAllDayTimes(): void {
    const allDay = !!this.dynamicForm.get('allDay')?.value;
    if (!allDay) return;
    ParkingPermitDynamicFormUtil.setAllDay(true, this.dynamicForm);
  }

  private getAllAreasSelected() {
    const areaCtrl = this.dynamicForm.get('areasId');
    if (!areaCtrl) return;

    const selectedAreas = areaCtrl.value;

    if (!selectedAreas || selectedAreas.length === 0) {
      this.dynamicForm.patchValue({ allAreasSelected: true });
      return;
    }

    const allAvailableAreas = this.allAreas()?.map((area) => area.id) ?? [];
    if (!allAvailableAreas.length) {
      this.dynamicForm.patchValue({ allAreasSelected: false });
      return;
    }

    const allSelected =
      allAvailableAreas.length === selectedAreas.length &&
      allAvailableAreas.every((areaId) => selectedAreas.includes(areaId));

    this.dynamicForm.patchValue({ allAreasSelected: allSelected });
  }

  private buildPayload(): any {
    this.applyAllDayTimes();
    this.getAllAreasSelected();

    const raw = this.dynamicForm.getRawValue();
    const { timeRange, ...rest } = raw;

    const fromTime = rest.fromTime ?? timeRange?.fromTime ?? null;
    const toTime = rest.toTime ?? timeRange?.toTime ?? null;

    const adRaw = this.dynamicForm.get('activeDays')?.value;
    const arr = Array.isArray(adRaw) ? adRaw : String(adRaw || '').split(',');
    const activeDays = arr
      .filter((s) => s !== '')
      .map((n) => parseInt(n, 10))
      .reduce((m, f) => m | f, 0);

    const mode = this.dynamicForm.get('timeGivingPermit')?.value;
    const startISO = Utils.toUtcStartOfDayISO(
      this.dynamicForm.get('permitStartDate')?.value
    );
    const endISO = Utils.toUtcStartOfDayISO(
      this.dynamicForm.get('permitEndDate')?.value
    );

    const totalDays = ParkingPermitDynamicFormUtil.getTotalDays(
      this.dynamicForm
    );
    const timeGivingPermitValue =
      this.dynamicForm.get('timeGivingPermit')?.value;

    const base = {
      ...rest,
      fromTime,
      toTime,
      permitDurationInDays: totalDays,
      activeDays,
      timeGivingPermit: timeGivingPermitValue,
      ...(mode === TimeEnum.Dates
        ? { startDate: startISO, endDate: endISO }
        : {}),
    };

    return DynamicFormsUtils.deepPrune(base);
  }

  private buildParkingPermitPayload(): any {
    const raw = this.dynamicForm.getRawValue();
    const { isNidORPassport, nid, passportID, ...rest } = raw;

    const birthDateISO = Utils.toUtcStartOfDayISO(
      this.dynamicForm.get('birthDate')?.value
    );

    const isPassport = isNidORPassport === '1';

    const base = {
      ...rest,
      birthDate: birthDateISO,
      isNidORPassport,
      ...(isPassport ? { passportID } : { nid }),
    };

    return DynamicFormsUtils.deepPrune(base);
  }

  // ---------------------------------------------------------------------------
  // Submit / reset / disable
  // ---------------------------------------------------------------------------

  onSubmit(): void {
    this.isSubmitted = false;
    console.log(this.dynamicForm.valid);
    const payload = this.isParkingPermitCreate()
      ? this.buildParkingPermitPayload()
      : this.buildPayload();

    if (this.dynamicForm.valid) {
      this.formSubmitted.emit({
        form: payload,
        isValid: this.dynamicForm.valid,
        status: this.dynamicForm.status,
        formTitle: this.title(),
      });
      this.isSubmitted = true;
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      DynamicFormsUtils.markAllFieldsAsTouched(this.dynamicForm);
    }
  }

  resetForm(): void {
    if (!this.dynamicForm) return;
    this.dynamicForm.reset();
    this.isSubmitted = false;
  }

  setDisabled(disabled: boolean): void {
    this.isDisabled = disabled;
    DynamicFormsUtils.setFormGroupDisabled(this.dynamicForm, disabled);
    DynamicFormsUtils.setAllConfigDisabled(disabled, this.rows());
    this.cdr.markForCheck();
  }

  // ---------------------------------------------------------------------------
  // Dynamic blocks
  // ---------------------------------------------------------------------------

  private setupIdPassportValidation(): void {
    const isNidOrPassportControl = this.dynamicForm.get('isNidORPassport');
    const nidControl = this.dynamicForm.get('nid');
    const passportIDControl = this.dynamicForm.get('passportID');

    if (!isNidOrPassportControl || !nidControl || !passportIDControl) return;

    ParkingPermitDynamicFormUtil.updateIdPassportValidation(
      isNidOrPassportControl.value,
      nidControl,
      passportIDControl,
      this.rows()
    );

    isNidOrPassportControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        ParkingPermitDynamicFormUtil.updateIdPassportValidation(
          value,
          nidControl,
          passportIDControl,
          this.rows()
        );
      });
  }

  private setupHoursBlock(): void {
    const f = this.dynamicForm;

    const apply = () => {
      const casual = DF.coerceBool(DF.ctrl(f, 'casualParkingSlot')?.value);
      DF.setDisabled(f, this.rows(), 'noFeeNeededDuration', !casual);
      DF.setRequired(f, this.rows(), 'noFeeNeededDuration', casual);
      if (!casual) {
        DF.ctrl(f, 'noFeeNeededDuration')?.setValue(null, {
          emitEvent: false,
        });
      }
    };

    apply();

    const casualCtrl = DF.ctrl(f, 'casualParkingSlot');
    if (casualCtrl) {
      casualCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => apply());
    }

    const allDayCtrl = DF.ctrl(f, 'allDay');
    if (allDayCtrl) {
      allDayCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.applyAllDayTimes());
    }
  }

  private setupPermitTypeBlock(): void {
    ParkingPermitDynamicFormUtil.setupPermitTypeBlock(
      this.dynamicForm,
      this.rows(),
      this.destroyRef
    );
  }


  getRadioValue(controlName: string): any {
    let val = this.dynamicForm?.get(controlName)?.value;

    return val !== undefined && val !== null ? val : '';
  }
}
