import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimeEnum } from '../../../types/enum/dateTypeEnum';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { DF, DynamicFormsUtils } from '../../../utils/dynamicForms';

export class ParkingPermitDynamicFormUtil {
  static setupPermitTypeBlock(
    dynamicForm: FormGroup,
    rows: DynamicRow[],
    destroyRef: DestroyRef
  ): void {
    const f = dynamicForm;
    const flip = (home: boolean) => {
      DF.setHidden(f, rows, 'permitTypeByStreet', !home);
      DF.setHidden(f, rows, 'permitType', home);

      DF.setRequired(f, rows, 'permitTypeByStreet', home);
      DF.setRequired(f, rows, 'permitType', !home);

      if (home) {
        DF.ctrl(f, 'permitType')?.setValue(null, { emitEvent: false });
      } else {
        DF.ctrl(f, 'permitTypeByStreet')?.setValue(null, { emitEvent: false });
      }

      const hasStreet = !!DF.ctrl(f, 'streetID')?.value;
      DF.setDisabled(f, rows, 'permitTypeByStreet', home && !hasStreet);
    };

    const apply = () =>
      flip(DF.coerceBool(DF.ctrl(f, 'isHomeAddressPermit')?.value));

    apply();

    const homeCtrl = DF.ctrl(f, 'isHomeAddressPermit');
    const streetCtrl = DF.ctrl(f, 'streetID');

    if (homeCtrl) {
      homeCtrl.valueChanges
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(() => apply());
    }

    if (streetCtrl) {
      streetCtrl.valueChanges
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(() => {
          const home = DF.coerceBool(homeCtrl?.value);
          if (home) {
            const hasStreet = !!streetCtrl.value;
            DF.setDisabled(f, rows, 'permitTypeByStreet', !hasStreet);
            DF.ctrl(f, 'permitTypeByStreet')?.updateValueAndValidity({
              emitEvent: true,
            });
          }
        });
    }
  }

  static updateHidenField(
    fieldName: string,
    hide: boolean,
    rows: DynamicRow[]
  ): void {
    DynamicFormsUtils.setConfigHide(fieldName, hide, rows);
  }

  // ... updateIdPassportValidation, setParkingTime, getTotalDays, timeRangeValidator, setAllDay — נשארים כמו אצלך

  static setupPermitDurationModeHandlers(
    dynamicForm: FormGroup,
    rows: DynamicRow[],
    destroyRef: DestroyRef
  ): DynamicRow[] {
    const modeCtrl = dynamicForm.get('timeGivingPermit');
    const daysCtrl = dynamicForm.get('permitDurationInDays');
    const monthsCtrl = dynamicForm.get('permitDurationInMonths');
    const yearsCtrl = dynamicForm.get('permitDurationInYears');
    const dateCtrl = dynamicForm.get('permitEndDate');
    const dateStartCtrl = dynamicForm.get('permitStartDate');

    if (
      !modeCtrl ||
      !daysCtrl ||
      !monthsCtrl ||
      !yearsCtrl ||
      !dateCtrl ||
      !dateStartCtrl
    )
      return rows;

    const setHidden = (name: string, hide: boolean) => {
      const ctrl = dynamicForm.get(name);
      if (!ctrl) return;
      hide
        ? ctrl.disable({ emitEvent: false })
        : ctrl.enable({ emitEvent: false });
      const cfg = DynamicFormsUtils.findConfigField(name, rows);
      if (cfg) cfg.hide = hide;
    };

    const clear = (c: any) => c?.setValue(null, { emitEvent: false });

    const numValidators = [Validators.min(0), Validators.pattern('^[0-9]+$')];

    const apply = (raw: any) => {
      const m = raw;

      [daysCtrl, monthsCtrl, yearsCtrl, dateCtrl, dateStartCtrl].forEach((c) =>
        c.clearValidators()
      );

      setHidden('permitDurationInDays', true);
      setHidden('permitDurationInMonths', true);
      setHidden('permitDurationInYears', true);
      setHidden('permitEndDate', true);
      setHidden('permitStartDate', true);

      switch (m) {
        case TimeEnum.Days:
          setHidden('permitDurationInDays', false);
          daysCtrl.setValidators([Validators.required, ...numValidators]);
          clear(monthsCtrl);
          clear(yearsCtrl);
          clear(dateCtrl);
          break;

        case TimeEnum.Months:
          setHidden('permitDurationInMonths', false);
          monthsCtrl.setValidators([Validators.required, ...numValidators]);
          clear(daysCtrl);
          clear(yearsCtrl);
          clear(dateCtrl);
          break;

        case TimeEnum.Years:
          setHidden('permitDurationInYears', false);
          yearsCtrl.setValidators([
            Validators.required,
            Validators.max(50),
            ...numValidators,
          ]);
          clear(daysCtrl);
          clear(monthsCtrl);
          clear(dateCtrl);
          break;

        case TimeEnum.Dates:
          setHidden('permitStartDate', false);
          setHidden('permitEndDate', false);
          dateCtrl.setValidators([Validators.required]);
          dateStartCtrl.setValidators([Validators.required]);
          clear(daysCtrl);
          clear(monthsCtrl);
          clear(yearsCtrl);
          break;
      }

      [daysCtrl, monthsCtrl, yearsCtrl, dateCtrl, dateStartCtrl].forEach((c) =>
        c.updateValueAndValidity({ emitEvent: false })
      );

      rows = [...rows]; // טריגר change detection למקרה שהטמפלט משתמש ב-hide
    };

    apply(modeCtrl.value);

    modeCtrl.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(apply);

    return rows;
  }

  static setParkingTime(
    dynamicForm: FormGroup,
    rows: DynamicRow[],
    isDisabled: boolean
  ): void {
    // Wrap the entire logic in setTimeout to prevent ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      const toBool = (v: any) => DF.coerceBool(v);

      const casualRaw = dynamicForm.get('casualParkingSlot')?.value;
      const casual = toBool(casualRaw);
      const noFeeCtrl = dynamicForm.get(
        'noFeeNeededDuration'
      ) as FormControl | null;

      if (!noFeeCtrl) return;

      const opts = { emitEvent: false };

      // If the entire form is disabled, keep everything disabled
      if (isDisabled) {
        noFeeCtrl.disable(opts);
        noFeeCtrl.setValue(null, opts);
        DF.setDisabled(dynamicForm, rows, 'noFeeNeededDuration', true);
        DF.setRequired(dynamicForm, rows, 'noFeeNeededDuration', true);

        return;
      }

      // Handle based on casual parking slot value
      if (casual) {
        // Enable the control and make it required
        noFeeCtrl.enable(opts);

        DF.setDisabled(dynamicForm, rows, 'noFeeNeededDuration', false);
        DF.setRequired(dynamicForm, rows, 'noFeeNeededDuration', true);
      } else {
        // Disable the control and clear its value
        noFeeCtrl.disable(opts);
        noFeeCtrl.setValue(null, opts);

        DF.setDisabled(dynamicForm, rows, 'noFeeNeededDuration', true);
        DF.setRequired(dynamicForm, rows, 'noFeeNeededDuration', false);
      }
    }, 0);
  }

  static timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate if no value
      }

      // Get the parent FormGroup (fromTime group)
      const parentGroup = control.parent;
      if (!parentGroup) {
        return null;
      }

      const fromTimeControl = parentGroup.get('fromTime');
      const toTimeControl = parentGroup.get('toTime');

      if (!fromTimeControl?.value || !toTimeControl?.value) {
        return null; // Need both times to validate
      }

      const fromTime = DynamicFormsUtils.timeStringToMinutes(
        fromTimeControl.value
      );
      const toTime = DynamicFormsUtils.timeStringToMinutes(toTimeControl.value);

      if (fromTime >= toTime) {
        return {
          timeRange: {
            fromTime: fromTimeControl.value,
            toTime: toTimeControl.value,
            message: 'שעת התחלה חייבת להיות קטנה משעת הסיום',
          },
        };
      }

      return null;
    };
  }

  static setAllDay(allDay: boolean, dynamicForm: FormGroup): void {
    const fromCtrl = DynamicFormsUtils.findControlByName(
      dynamicForm,
      'fromTime'
    );
    const toCtrl = DynamicFormsUtils.findControlByName(dynamicForm, 'toTime');
    const opts = { emitEvent: false };

    [fromCtrl, toCtrl].forEach((ctrl) => {
      if (!ctrl) return;
      if (allDay) {
        ctrl.enable(opts); // ensure writable
        ctrl.setValue('00:00', opts); // or '00:00:00' if server expects seconds
        ctrl.disable(opts); // optional UX
      } else {
        ctrl.enable(opts);
      }
    });
  }

  static getTotalDays(dynamicForm: FormGroup): number | null {
    const mode = dynamicForm.get('timeGivingPermit')?.value;
    let totalDays: number | null = null;

    if (mode === TimeEnum.Days)
      totalDays = Number(dynamicForm.get('permitDurationInDays')?.value) || 0;
    if (mode === TimeEnum.Months)
      totalDays =
        (Number(dynamicForm.get('permitDurationInMonths')?.value) || 0) * 30; // approx
    if (mode === TimeEnum.Years)
      totalDays =
        (Number(dynamicForm.get('permitDurationInYears')?.value) || 0) * 365; // approx
    if (mode === TimeEnum.Dates) {
      const end = dynamicForm.get('permitEndDate')?.value;
      const start = dynamicForm.get('permitStartDate')?.value;
      if (end) {
        const start0 = start ? new Date(start) : new Date(); // default to today if start missing
        const end0 = new Date(end);

        // normalize to local midnight
        start0.setHours(0, 0, 0, 0);
        end0.setHours(0, 0, 0, 0);

        // if same date, extend end by 1 day (inclusive rule)
        if (end0.getTime() === start0.getTime()) {
          end0.setDate(end0.getDate() + 1);
        }

        const msPerDay = 86400000;
        return Math.max(0, Math.ceil((+end0 - +start0) / msPerDay));
      }
    }
    return totalDays;
  }

  static updateIdPassportValidation(
    radioValue: string,
    nidControl: AbstractControl,
    passportContol: AbstractControl,
    rows: DynamicRow[]
  ): void {
    const isId = radioValue === '0';
    const isPassport = radioValue === '1';

    // Clear existing validators
    nidControl.clearValidators();
    passportContol.clearValidators();

    // Add required validator
    const validators: ValidatorFn[] = [];

    if (isId) {
      // Israeli ID: 9 digits with checksum
      validators.push(DynamicFormsUtils.israeliIdValidator());
      validators.push(Validators.maxLength(9));
      validators.push(Validators.minLength(9));
      validators.push(Validators.required);
      passportContol.setValue('');
      // Update field config label/placeholder if needed
      // this.updateFieldLabel('nid', ' תעודת זהות');
      ParkingPermitDynamicFormUtil.updateHidenField('passportID', true, rows);
      ParkingPermitDynamicFormUtil.updateHidenField('nid', false, rows);
      DynamicFormsUtils.setConfigIsRequired('nid', true, rows);
      DynamicFormsUtils.setConfigIsRequired('passportID', false, rows);
      nidControl.setValidators(validators);
    } else if (isPassport) {
      // Passport: 6-9 alphanumeric
      validators.push(DynamicFormsUtils.passportValidator());
      validators.push(Validators.maxLength(9));
      validators.push(Validators.minLength(6));
      validators.push(Validators.required);
      nidControl.setValue('');
      // Update field config label/placeholder if needed
      // this.updateFieldLabel('nid', ' דרכון');
      DynamicFormsUtils.setConfigIsRequired('nid', false, rows);
      DynamicFormsUtils.setConfigIsRequired('passportID', true, rows);
      ParkingPermitDynamicFormUtil.updateHidenField('nid', true, rows);
      ParkingPermitDynamicFormUtil.updateHidenField('passportID', false, rows);
      passportContol.setValidators(validators);
    }

    // Revalidate
    nidControl.updateValueAndValidity();
    passportContol.updateValueAndValidity();
  }
}
