import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  DynamicField,
  DynamicRow,
} from '../../../../types/infrastructure/InfrastructureTypes';
import { FieldDetailsComponent } from '../field-details/field-details.component';
import { IdValue } from '../../../../types/advanced-search/form-tab.model';
import { DynamicFieldSize } from '../../../../types/enum/infrastructureTablesEnum';
import { FieldTextComponent } from "../field-text/field-text.component";
import { FieldImageComponent } from "../field-image/field-image.component";
import { FieldTextEditorComponent } from "../field-text-editor/field-text-editor.component";

@Component({
  selector: 'app-field-dynamic',
  templateUrl: './field-dynamic.component.html',
  styleUrls: ['./field-dynamic.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FieldDetailsComponent,
    FieldTextComponent,
    FieldImageComponent,
    FieldTextEditorComponent
],
})
export class FieldDynamicComponent implements OnInit, OnChanges {
  @Input() rows: DynamicRow[] = [];
  @Input() imagesOptions: IdValue[] = [];
  @Input() textsOptions: IdValue[] = [];
  @Input() isDraft: boolean = false;
  @Input() draftOrLetterData: any = null; 
  @Input() isEdit = false;
  @Input() isDisable = false;

  @Output() valueChanged = new EventEmitter<any>();
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() submit = new EventEmitter<any>();
  @Output() preview = new EventEmitter<any>();
  @Output() indictmentChanged = new EventEmitter<any>();

  @ViewChild(FieldDetailsComponent) fieldDetailsRef!: FieldDetailsComponent;
  
  private readonly _form = signal<FormGroup | null>(null);
  private readonly _textEditorValue = signal<string>('');
  private readonly _customValues = signal<Record<string, any>>({});
  private readonly _detailsFormValues = signal<any>({});

  readonly form = computed(() => this._form());
  readonly textEditorValue = computed(() => this._textEditorValue());
  readonly customValues = computed(() => this._customValues());
  readonly detailsFormValues = computed(() => this._detailsFormValues());

  private readonly fb = inject(FormBuilder);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.createForm();
      const form = this.form();
      if (form) {
        this.formReady.emit(form);
      }
    }
    if (
      changes['draftOrLetterData'] &&
      changes['draftOrLetterData'].currentValue
    ) {
      this.fieldDetailsRef?.patchFormWithData(this.draftOrLetterData);
      this.patchFormWithData(this.draftOrLetterData);
    }
  }

  ngOnInit(): void {
    if (!this.draftOrLetterData) {
      this.createForm();
      const form = this.form();
      if (form) {
        this.formReady.emit(form);
      }
    }
    this.patchFormWithData(this.draftOrLetterData);
  }

  patchFormWithData(data: any) {
    if (!data) return;

    const templates = data.templates ?? [];

    this.rows = this.rows.map((row) => ({
      ...row,
      row: row.row.map((field) => {
        if (['text', 'text-area', 'image'].includes(field.type)) {
          const match = templates.find((t: any) => t.order === field.order);
          if (match) {
            if (match.textAreaValue) {
              this._textEditorValue.set(match.textAreaValue);
              return {
                ...field,
                value:
                  field.type === 'text-area'
                    ? match.textAreaValue
                    : match.templateId ?? '',
              };
            } else {
              return { ...field, value: match.templateId ?? '' };
            }
          }
        } else if (data[field.name] !== undefined) {
          return { ...field, value: data[field.name] };
        }

        return field;
      })
    }));

    this.createForm();

    const form = this.form();
    if (form) {
      const patchable: any = {};
      Object.keys(form.controls).forEach((key) => {
        if (data[key] !== undefined) {
          patchable[key] = data[key];
        }
      });

      form.patchValue(patchable, { emitEvent: false });
    }
  }

  createForm(): void {
    const group: { [key: string]: any } = {};

    this.rows.forEach((row) =>
      row.row.forEach((field) => {
        group[field.name] = this.fb.control(
          field.value ?? '',
          this.getValidators(field)
        );
      })
    );
    this._form.set(this.fb.group(group));
  }

  getValidators(field: DynamicField): ValidatorFn[] {
    const v = field.validations || {};
    const validators: ValidatorFn[] = [];
    if (v.required) validators.push(Validators.required);
    if (v.maxLength) validators.push(Validators.maxLength(v.maxLength));
    if (v.minLength) validators.push(Validators.minLength(v.minLength));
    if (v.pattern) validators.push(Validators.pattern(v.pattern));
    return validators;
  }

  onCustomFieldValueChanged(fieldName: string, value: any) {
    this._customValues.update(values => ({ ...values, [fieldName]: value }));
    this.emitCombinedValues();
  }

  emitCombinedValues() {
    const form = this.form();
    const reactiveValues = form?.getRawValue() || {};
    const combined = { ...reactiveValues, ...this.customValues() };
    this.valueChanged.emit(combined);
  }

  onDetailsFormSubmit(event: any) {
    if (event.isValid) {
      this._detailsFormValues.set(event.form.getRawValue());
    }
  }
  onIsIndictmentChanged(event: any) {
    console.log(event)
    this.indictmentChanged.emit(event);
    setTimeout(() => {
      this.fieldDetailsRef.setIsIndictment(event);
    });
  }
  onEditorDataChange(event: string, fieldName: string): void {
    // Update the reactive form control
    const form = this.form();
    const control = form?.get(fieldName);
    if (control) {
      control.setValue(event);
    }
  }

  public triggerSubmit(): void {
    if (this.fieldDetailsRef) {
      this.fieldDetailsRef.onSubmit();
      if (!this.fieldDetailsRef.dynamicForm?.valid) {
        console.log('invalid');
        return;
      }
    }

    const form = this.form();
    if (form?.invalid) {
      form.markAllAsTouched();
      return;
    }

    const reactiveValues = form?.getRawValue() || {};
    const allValues = {
      ...reactiveValues,
      ...this.customValues(),
      ...this.detailsFormValues(),
    };

    const templates: any[] = [];

    this.rows.forEach((row, rowIndex) =>
      row.row.forEach((field) => {
        const value = allValues[field.name];
        const isTemplate = ['text', 'text-area', 'image'].includes(field.type);
        const isNonEmpty =
          value !== undefined && value !== null && value !== '';
        const isTextArea = field.type === 'text-area';
        if (
          isTemplate &&
          field.order != null &&
          field.name !== 'authorityID' &&
          isNonEmpty
        ) {
          templates.push({
            templateId: !isTextArea ? value : null,
            textAreaValue: isNonEmpty ? value : null,
            order: field.order,
            name: field.name,
            // row: rowIndex,
          });
        }
      })
    );

    const details = this.pickDetailsFields(this.detailsFormValues());

    this.submit.emit({
      combined: {
        details,
        templates,
      },
    });
  }

  public triggerPreview(): void {
    if (this.fieldDetailsRef) {
      this.fieldDetailsRef.onSubmit();
      if (!this.fieldDetailsRef.dynamicForm?.valid) {
        console.log('invalid');
        return;
      }
    }

    const form = this.form();
    if (form?.invalid) {
      form.markAllAsTouched();
      return;
    }

    const reactiveValues = form?.getRawValue() || {};
    const allValues = {
      ...reactiveValues,
      ...this.customValues(),
      ...this.detailsFormValues(),
    };

    const templates: any[] = [];

    this.rows.forEach((row, rowIndex) =>
      row.row.forEach((field) => {
        const value = allValues[field.name];
        const isTemplate = ['text', 'text-area', 'image'].includes(field.type);
        const isNonEmpty =
          value !== undefined && value !== null && value !== '';
        const isTextArea = field.type === 'text-area';
        if (
          isTemplate &&
          field.order != null &&
          field.name !== 'authorityID' &&
          isNonEmpty
        ) {
          templates.push({
            templateId: !isTextArea ? value : null,
            textAreaValue: isTextArea ? value : null,
            order: field.order,
            row: rowIndex,
            place: (field as any).place ?? undefined,
            name: field.name,
            maxWidth:
              field.size == DynamicFieldSize.Regular ? '1170px' : '350px',
          });
        }
      })
    );
    console.log(templates);
    this.preview.emit({
      templates,
    });
  }

  pickDetailsFields(source: any): any {
    const keys = [
      'id',
      'name',
      'smsDisplayName',
      'draftsAndLettersTicketTypes',
      'isIndictment',
      'emailDisplayName',
      'authorityID',
      'draftsAndLettersTypeId',
    ];
    return Object.fromEntries(keys.map((k) => [k, source[k]]));
  }

  public isDirty(): boolean {
    const isDetailsDirty = this.fieldDetailsRef?.isDirty() || false;
    const form = this.form();
    return form?.dirty || isDetailsDirty;
  }
}
