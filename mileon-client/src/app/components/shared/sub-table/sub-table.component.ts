import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { ConstPath } from '../../../constants/const_path';   
import { TableErrors } from '../../../constants/errors';
import { BaseFormComponent } from '../base-form/base-form.component';
import { SubTable } from '../../../types/subTableField';
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
  private cdr = inject(ChangeDetectorRef);

  // Inputs and Outputs
  @Input({ required: true }) set data(value: SubTable) {
    this._data.set(value);
    this._localData.set(JSON.parse(JSON.stringify(value)));
  }
  @Output() fieldUpdate = new EventEmitter<{ key: string; value: any }>();

  // Signals
  private _data = signal<SubTable>({} as SubTable);
  private _localData = signal<SubTable>({} as SubTable);
  private _errorMsg = signal<string>('');

  // Public Signals and Computed Values
  readonly localData = this._localData.asReadonly();
  readonly errorMsg = this._errorMsg.asReadonly();

  // Constants
  readonly Icons = ConstPath;

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

  emitChange(field: any, newValue: any) {
    const updatedField = { ...field, value: String(newValue) };
    
    // Update the local data
    const currentData = this._localData();
    const updatedFields = currentData.fields.map(f => 
      f.key === field.key ? updatedField : f
    );
    
    this._localData.set({
      ...currentData,
      fields: updatedFields
    });

    // Emit the change
    this.fieldUpdate.emit({ key: field.key, value: updatedField.value });
  }
}
