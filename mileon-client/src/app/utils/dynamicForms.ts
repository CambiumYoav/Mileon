import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DynamicRow } from '../types/infrastructure/InfrastructureTypes';
import { TimeEnum } from '../types/enum/dateTypeEnum';

export class DynamicFormsUtils {
  static deepPrune<T = any>(value: T): T {
    // keep 0 and false; drop null/undefined/''/whitespace-only
    const shouldDrop = (v: any) =>
      v === null ||
      v === undefined ||
      (typeof v === 'string' && v.trim() === '');

    const walk = (v: any): any => {
      if (Array.isArray(v)) {
        const arr = v.map(walk).filter((x) => !shouldDrop(x));
        return arr.length ? arr : undefined;
      }
      if (v && typeof v === 'object') {
        const out: any = {};
        for (const [k, val] of Object.entries(v)) {
          const cleaned = walk(val);
          if (!shouldDrop(cleaned)) out[k] = cleaned;
        }
        // drop empty object
        return Object.keys(out).length ? out : undefined;
      }
      return v;
    };

    const cleaned = walk(value);
    // If top-level becomes undefined, return {} instead
    return (cleaned ?? {}) as T;
  }

  static findControlByName(
    root: AbstractControl,
    name: string
  ): FormControl | null {
    if (root instanceof FormControl) return null;
    const fg = root as FormGroup;
    for (const [key, ctrl] of Object.entries(fg.controls)) {
      if (key === name && ctrl instanceof FormControl) return ctrl;
      const child = this.findControlByName(ctrl, name);
      if (child) return child;
    }
    return null;
  }
  static findConfigField(name: string, rows: DynamicRow[]) {
    for (const row of rows) {
      const f = row.row.find((x) => x.name === name);
      if (f) return f;
    }
    return null;
  }
  static setConfigDisabled(
    name: string,
    disabled: boolean,
    rows: DynamicRow[]
  ) {
    const cfg = DynamicFormsUtils.findConfigField(name, rows);
    if (cfg) {
      cfg.disabled = disabled;
      rows = [...rows]; // trigger change detection if OnPush
    }
  }

  static setConfigHide(name: string, hide: boolean, rows: DynamicRow[]) {
    const cfg = DynamicFormsUtils.findConfigField(name, rows);
    if (cfg) {
      cfg.hide = hide;
      rows = [...rows]; // trigger change detection if OnPush
    }
  }

  static setConfigIsRequired(
    name: string,
    isRequired: boolean,
    rows: DynamicRow[]
  ) {
    const cfg = DynamicFormsUtils.findConfigField(name, rows);
    if (cfg) {
      cfg.isRequired = isRequired;
      cfg.validations = { ...cfg.validations, required: isRequired };
      rows = [...rows]; // trigger change detection if OnPush
    }
  }
  static getFieldValidations(field: any): ValidatorFn[] {
    const validations: ValidatorFn[] = [];
    const { validations: fieldValidations } = field;

    if (fieldValidations) {
      if (fieldValidations.required) validations.push(Validators.required);
      if (fieldValidations.maxLength)
        validations.push(Validators.maxLength(fieldValidations.maxLength));
      if (fieldValidations.minLength)
        validations.push(Validators.minLength(fieldValidations.minLength));
      if (fieldValidations.pattern)
        validations.push(Validators.pattern(fieldValidations.pattern));
      if (fieldValidations.min !== undefined)
        validations.push(Validators.min(fieldValidations.min));
      if (fieldValidations.max !== undefined)
        validations.push(Validators.max(fieldValidations.max));
      if (field.name === 'birthDate') {
        validations.push(DynamicFormsUtils.birthDateValidator());
      }
    }

    return validations;
  }
  static birthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates

      if (birthDate >= today) {
        return {
          birthDate: {
            actualValue: control.value,
            message: 'תאריך לידה חייב להיות קטן מהתאריך של היום',
          },
        };
      }

      return null;
    };
  }
  static markAllFieldsAsTouched(group: FormGroup): void {
    Object.keys(group.controls).forEach((key) => {
      const c = group.get(key);
      if (c instanceof FormGroup) {
        this.markAllFieldsAsTouched(c);
      } else {
        c?.markAsTouched();
        c?.updateValueAndValidity({ emitEvent: false });
      }
    });
  }
  static timeFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }

      const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;

      if (!timeRegex.test(control.value)) {
        return {
          timeFormat: {
            actualValue: control.value,
            expectedFormat: 'HH:MM (00:00-23:59)',
          },
        };
      }

      return null;
    };
  }

  static timeStringToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  static dateRangeValidator(
    startDateFieldName: string,
    dynamicForm: FormGroup
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate if no value (let required validator handle it)
      }

      const startDateControl = dynamicForm?.get(startDateFieldName);
      if (!startDateControl || !startDateControl.value) {
        return null; // No start date to compare against
      }

      const startDate = new Date(startDateControl.value);
      const endDate = new Date(control.value);

      if (endDate <= startDate) {
        return {
          dateRange: {
            actualValue: control.value,
            requiredMinDate: startDateControl.value,
          },
        };
      }

      return null;
    };
  }

  static getNestedFieldErrors(
    groupName: string,
    fieldName: string,
    dynamicForm: FormGroup
  ): any {
    const group = dynamicForm.get(groupName) as FormGroup;
    if (!group) return null;

    const control = group.get(fieldName);
    return control?.errors || null;
  }

  isNestedFieldValid(
    groupName: string,
    fieldName: string,
    dynamicForm: FormGroup
  ): boolean {
    const group = dynamicForm.get(groupName) as FormGroup;
    if (!group) return true;

    const control = group.get(fieldName);
    if (!control || control.disabled) return true;

    return control.touched ? control.valid : true;
  }

  static patchDynamicForm(formConfig: any[], data: any) {
    if (!data || !formConfig) return;

    // Pre-compute common stuff once
    const fromRaw = data.fromTime ?? data.timeRange?.fromTime;
    const toRaw = data.toTime ?? data.timeRange?.toTime;
    const allDay = DynamicFormsUtils.isAllDayFromTimes(fromRaw, toRaw);

    // 1) Field-by-field patch
    for (const row of formConfig) {
      for (const field of row.row) {
        // (a) special fields that must patch regardless of data.hasOwnProperty
        if (field.name === 'allDay') {
          DynamicFormsUtils.patchAllDayField(field, allDay);
          continue;
        }
        if (field.name === 'fromTime') {
          field.value = DynamicFormsUtils.hhmm(fromRaw);
          continue;
        }
        if (field.name === 'toTime') {
          field.value = DynamicFormsUtils.hhmm(toRaw);
          continue;
        }

        // (b) normal fields—only if present in payload
        if (!Object.prototype.hasOwnProperty.call(data, field.name)) continue;

        if (field.name === 'activeDays') {
          DynamicFormsUtils.patchActiveDaysField(field, data.activeDays);
          continue;
        }
        // if (field.name === 'genderID') {
        //   DynamicFormsUtils.patchAllDayField(field, data.genderID);
        //   continue;
        // }
        if (field.type === 'date' && data[field.name]) {
          field.value = DynamicFormsUtils.toLocalDateISO(data[field.name]);
          continue;
        }

        DynamicFormsUtils.patchGenericField(field, data[field.name]);
      }
    }

    // 2) Derive & seed computed fields (timeGivingPermit + duration)
    DynamicFormsUtils.deriveDurationFields(formConfig, data);

    // 3) If you still render nested "timeRange", seed its children
    DynamicFormsUtils.seedTimeRange(formConfig, fromRaw, toRaw);
  }

  static setFormGroupDisabled(form: FormGroup | undefined, disabled: boolean) {
    if (!form) return;
    disabled
      ? form.disable({ emitEvent: false })
      : form.enable({ emitEvent: false });
  }

  // Flip the UI config 'disabled' flags and return a new array to trigger OnPush
  static setAllConfigDisabled(
    disabled: boolean,
    rows: DynamicRow[]
  ): DynamicRow[] {
    for (const row of rows) {
      for (const field of row.row) {
        field.disabled = disabled;
      }
    }
    return [...rows];
  }
  // ---------- HELPERS (small/focused) ----------

  private static findField(formConfig: any[], name: string) {
    for (const row of formConfig) {
      const f = row.row.find((x: any) => x.name === name);
      if (f) return f;
    }
    return null;
  }

  private static setFieldValue(formConfig: any[], name: string, value: any) {
    const f = DynamicFormsUtils.findField(formConfig, name);
    if (f) f.value = value;
  }

  private static toLocalDateISO(input: any): string {
    const date = new Date(input);
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  private static asNum(v: any): number | null {
    return v === null || v === undefined ? null : Number(v);
  }

  static isAllDayFromTimes(from?: any, to?: any) {
    const norm = (v: any) => String(v ?? '').trim();
    const isZero = (v: string) => /^0{1,2}:0{2}(:0{2})?$/.test(v);
    return isZero(norm(from)) && isZero(norm(to));
  }

  static hhmm(v: any): string | null {
    const s = String(v ?? '').trim();
    if (!s) return null;
    const m = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(s);
    return m ? `${m[1]}:${m[2]}` : s;
  }

  static isTruthyOptionValue(v: any) {
    return (
      v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true'
    );
  }

  private static patchAllDayField(field: any, allDay: boolean) {
    if (field.type === 'checkbox') {
      field.value = allDay; // boolean checkbox
      return;
    }
    if (
      field.type === 'checkboxOptions' &&
      Array.isArray(field.checkBoxOptions)
    ) {
      field.checkBoxOptions = field.checkBoxOptions.map((o: any) => ({
        ...o,
        checked: allDay && DynamicFormsUtils.isTruthyOptionValue(o.value),
      }));
      field.value = allDay ? '1' : '';
    }
  }

  private static patchActiveDaysField(field: any, activeDays: any) {
    const mask = Number(activeDays || 0);
    const selected = DynamicFormsUtils.maskToValues(
      mask,
      field.checkBoxOptions
    );
    field.checkBoxOptions = DynamicFormsUtils.markChecked(
      field.checkBoxOptions,
      selected
    );
    field.value = selected.join(','); // keep CSV for your checkbox component
  }

  static maskToValues(mask: number, options: any[] = []): number[] {
    // assumes options values are powers of two (1,2,4,8,...)
    return (options ?? [])
      .map((o) => Number(o.value))
      .filter((v) => !!v && (mask & v) === v);
  }

  static markChecked(opts: any[] = [], selected: number[] = []) {
    const set = new Set(selected.map(Number));
    return opts.map((o) => ({ ...o, checked: set.has(Number(o.value)) }));
  }

  private static patchGenericField(field: any, value: any) {
    field.value = value !== null && value !== undefined ? value : '';
  }

  private static deriveDurationFields(formConfig: any[], data: any) {
    const mode = data.timeGivingPermit; // 0 days, 1 months, 2 years, 3 dates
    const days = DynamicFormsUtils.asNum(data.permitDurationInDays) ?? 0;

    // ensure select shows server mode
    DynamicFormsUtils.setFieldValue(formConfig, 'timeGivingPermit', mode);

    const isDays = mode === 0 || mode === (TimeEnum as any)?.Days;
    const isMonths = mode === 1 || mode === (TimeEnum as any)?.Months;
    const isYears = mode === 2 || mode === (TimeEnum as any)?.Years;
    const isDates = mode === 3 || mode === (TimeEnum as any)?.Dates;

    if (isDays) {
      DynamicFormsUtils.setFieldValue(
        formConfig,
        'permitDurationInDays',
        data.permitDurationInDays ?? days
      );
      return;
    }
    if (isMonths) {
      const months =
        data.permitDurationInMonths != null
          ? Number(data.permitDurationInMonths)
          : days
          ? Math.ceil(days / 30)
          : null;
      DynamicFormsUtils.setFieldValue(
        formConfig,
        'permitDurationInMonths',
        months
      );
      return;
    }
    if (isYears) {
      const years =
        data.permitDurationInYears != null
          ? Number(data.permitDurationInYears)
          : days
          ? Math.ceil(days / 365)
          : null;
      DynamicFormsUtils.setFieldValue(
        formConfig,
        'permitDurationInYears',
        years
      );
      return;
    }

    if (isDates) {
      const start = data.startDate;
      const end = data.endDate;

      DynamicFormsUtils.setFieldValue(formConfig, 'permitStartDate', start);
      DynamicFormsUtils.setFieldValue(formConfig, 'permitEndDate', end);

      // if days missing but both dates exist, compute once for display
      if (data.permitDurationInDays == null && start && end) {
        const s = new Date(DynamicFormsUtils.toLocalDateISO(start));
        const e = new Date(DynamicFormsUtils.toLocalDateISO(end));
        const msPerDay = 86400000;
        const diff = Math.max(0, Math.ceil((+e - +s) / msPerDay));
        DynamicFormsUtils.setFieldValue(
          formConfig,
          'permitDurationInDays',
          diff
        );
      }
    }
  }

  private static seedTimeRange(formConfig: any[], fromRaw: any, toRaw: any) {
    const f = DynamicFormsUtils.findField(formConfig, 'timeRange');
    if (!f || !Array.isArray(f.fields)) return;

    const from = DynamicFormsUtils.hhmm(fromRaw);
    const to = DynamicFormsUtils.hhmm(toRaw);

    const fromField = f.fields.find((x: any) => x.name === 'fromTime');
    const toField = f.fields.find((x: any) => x.name === 'toTime');

    if (fromField) fromField.value = from;
    if (toField) toField.value = to;
  }

  static israeliIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const id = control.value.toString().trim();

      // Must be 9 digits
      if (!/^\d{9}$/.test(id)) {
        return {
          israeliId: {
            actualValue: control.value,
            message: 'תעודת זהות חייבת להכיל 9 ספרות',
          },
        };
      }

      // Validate checksum using Luhn algorithm
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        let digit = parseInt(id[i]);
        if (i % 2 === 0) {
          digit *= 1;
        } else {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        sum += digit;
      }

      if (sum % 10 !== 0) {
        return {
          israeliId: {
            actualValue: control.value,
            message: 'תעודת זהות לא תקינה',
          },
        };
      }

      return null;
    };
  }

  static passportValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const passport = control.value.toString().trim();

      // Passport should be 6-9 alphanumeric characters
      if (!/^[A-Z0-9]{6,9}$/i.test(passport)) {
        return {
          passport: {
            actualValue: control.value,
            message: 'מספר דרכון לא תקין (6-9 תווים)',
          },
        };
      }

      return null;
    };
  }
}
export const DF = {
  coerceBool: (v: any) => v === true || v === 'true' || v === 1 || v === '1',

  // safe control getter
  ctrl(form: FormGroup, name: string) {
    const c = form.get(name);
    if (!c) return c as null;
    return c as AbstractControl | null;
  },

  // batch ops on config + control
  setDisabled(form: FormGroup, rows: any[], name: string, disabled: boolean) {
    const c = DF.ctrl(form, name);
    if (c)
      disabled
        ? c.disable({ emitEvent: false })
        : c.enable({ emitEvent: false });
    DynamicFormsUtils.setConfigDisabled(name, disabled, rows);
  },

  setHidden(form: FormGroup, rows: any[], name: string, hide: boolean) {
    // hide in config; also disable when hidden
    DynamicFormsUtils.setConfigHide(name, hide, rows);
    DF.setDisabled(form, rows, name, hide);
  },

  setRequired(
    form: FormGroup,
    rows: any[],
    name: string,
    required: boolean,
    extra: ValidatorFn[] = []
  ) {
    const c = DF.ctrl(form, name);
    DynamicFormsUtils.setConfigIsRequired(name, required, rows);
    if (!c) return;
    const validators = required ? [Validators.required, ...extra] : [...extra];
    c.clearValidators();
    c.setValidators(validators);
    c.updateValueAndValidity({ emitEvent: false });
  },

  // bitmask helpers
  maskHas: (mask: number, flag: number) => (mask & flag) === flag,
  maskAdd: (mask: number, flag: number) => mask | flag,
  maskRemove: (mask: number, flag: number) => mask & ~flag,

  // time helpers
  timeToMinutes: (hhmm: string) => {
    if (!hhmm) return NaN;
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  },

  // cross-field from<to validator
  fromLessThanTo(fromName = 'fromTime', toName = 'toTime'): ValidatorFn {
    return (toCtrl: AbstractControl) => {
      const parent = toCtrl.parent;
      if (!parent) return null;
      const from = parent.get(fromName)?.value;
      const to = parent.get(toName)?.value;
      if (!from || !to) return null;
      const ok = DF.timeToMinutes(from) < DF.timeToMinutes(to);
      return ok ? null : { timeRange: true };
    };
  },

  // wiring helpers
  on(form: FormGroup, name: string, fn: (v: any) => void) {
    const c = DF.ctrl(form, name);
    if (!c) return { unsubscribe() {} };
    return c.valueChanges.subscribe(fn);
  },
};
