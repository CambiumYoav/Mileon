import {
  Component,
  Input,
  OnInit,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimelineSettingsFormService } from '../../timeline-settings-form.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material-module';
import { SelectComponent } from '../../../shared/base/select/select.component';
import { InputTextComponent } from '../../../shared/base/inputs/input-text/input-text.component';
import { InputDateComponent } from '../../../shared/base/inputs/input-date/input-date.component';
import { InputCheckboxComponent } from '../../../shared/base/inputs/input-checkbox/input-checkbox.component';
import { InputPhoneComponent } from '../../../shared/base/inputs/input-phone/input-phone.component';

@Component({
  selector: 'app-config-table',
  templateUrl: './config-table.component.html',
  styleUrls: ['./config-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SelectComponent,
    InputTextComponent,
    InputDateComponent,
    InputCheckboxComponent,
    InputPhoneComponent,
  ],
})
export class ConfigTableComponent implements OnInit {
  private fbService = inject(TimelineSettingsFormService);

  @Input() height?: number = 200;
  @Input() inputFields: any;

  // Signals for reactive state management
  private formDataSignal = toSignal(
    this.fbService.formData$.pipe(distinctUntilChanged()),
    { initialValue: null }
  );

  dynamicForm = signal<FormGroup | null>(null);
  isSubmitted = signal(false);
  formState = signal(false);

  // Computed signals
  form = computed(() => {
    return this.inputFields ? Array.from(Object.values(this.inputFields)) : [];
  });

  formGroups = computed(() => {
    return this.inputFields ? Object.keys(this.inputFields) : [];
  });

  constructor() {
    // Effect to handle form data changes
    effect(() => {
      const data = this.formDataSignal();
      if (data && data.controls) {
        this.fbService.applyValidators(this.inputFields);
        this.formState.set(true);
        this.dynamicForm.set(this.fbService.getForm());
      }
    });
  }

  ngOnInit(): void {
    // Initialize form and form groups based on input fields
    if (this.inputFields) {
      // The computed signals will automatically update when inputFields change
    }
  }

  // Helper methods for template
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getArrayOrEmpty(value: any): any[] {
    return Array.isArray(value) ? value : [];
  }

  // Get nested form control for validation
  getFieldControl(groupIndex: number, fieldName: string) {
    const groupName = this.formGroups()[groupIndex];
    return this.dynamicForm()?.get(groupName)?.get(fieldName);
  }

  // Check if field is invalid
  isFieldInvalid(groupIndex: number, fieldName: string): boolean {
    const control = this.getFieldControl(groupIndex, fieldName);
    return !!(control?.invalid && control?.touched) || 
           !!(this.isSubmitted() && control?.errors?.['required']);
  }

  // Get field error message
  getFieldErrorMessage(groupIndex: number, fieldName: string): string {
    const control = this.getFieldControl(groupIndex, fieldName);
    if (control?.errors?.['required']) {
      return 'שדה חובה';
    }
    return '';
  }
}
