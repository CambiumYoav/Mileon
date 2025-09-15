import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  effect,
  inject,
  model,
  signal
} from '@angular/core';
import { ConstPath } from '../../../constants/const_path';   
import { TableErrors } from '../../../constants/errors';
import { BaseFormComponent } from '../base-form/base-form.component';
import { SubTable, SubTableField } from '../../../types/subTableField';
import { FormsModule } from '@angular/forms';
import { RedLineErrorComponent } from '../errors/red-line-error/red-line-error.component';

@Component({
  selector: 'app-sub-table',
  templateUrl: './sub-table.component.html',
  styleUrls: ['./sub-table.component.scss'],
  standalone: true,
  imports: [FormsModule, RedLineErrorComponent]
})
export class SubTableComponent extends BaseFormComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  // Inputs and Outputs
  @Input({ required: true }) set data(value: SubTable) {
    // Ensure each field has a unique key
    const processedValue = {
      ...value,
      fields: value.fields?.map((field, index) => ({
        ...field,
        key: field.key || `${field.label}-${index}` // Use label-index as fallback key
      }))
    };
    
    this._data.set(processedValue);
    this._localData.set(structuredClone(processedValue));
  }

  @Output() fieldUpdate = new EventEmitter<{ key: string; value: string }>();

  // Signals
  private readonly _data = signal<SubTable>({} as SubTable);
  private readonly _localData = signal<SubTable>({} as SubTable);
  private readonly _errorMsg = signal<string>('');

  // Public Signals and Computed Values
  protected readonly localData = computed(() => this._localData());
  protected readonly errorMsg = computed(() => this._errorMsg());

  // Constants
  protected readonly Icons = ConstPath;

  constructor() {
    super();
    
    // Effect to handle data changes
    effect(() => {
      const data = this._data();
      if (!data) return;

      if (Object.keys(data).length === 0) {
        this._errorMsg.set(TableErrors.NOT_FOUND);
        this.resetTable();
        this.cdr.detectChanges();
      } else {
        this._errorMsg.set('');
      }
    });
  }

  resetTable(): void {
    this._data.set({} as SubTable);
  }

  protected emitChange(field: SubTableField, newValue: string | number | boolean): void {
    const updatedField = { ...field, value: String(newValue) };
    
    // Update the local data using computed update
    this._localData.update(currentData => ({
      ...currentData,
      fields: currentData.fields.map(f => 
        f.key === field.key ? updatedField : f
      )
    }));

    // Emit the change
    this.fieldUpdate.emit({ key: field.key, value: updatedField.value });
  }
}
