import { 
  Component, 
  Input, 
  OnInit, 
  signal, 
  computed,
  ChangeDetectionStrategy 
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IdValue } from '../../../../types/advanced-search/form-tab.model';
import { DynamicFieldSize } from '../../../../types/enum/infrastructureTablesEnum';
import { DynamicField } from '../../../../types/infrastructure/InfrastructureTypes';
import { SelectedTemplateFieldComponent } from "../selected-template-field/selected-template-field.component";
import { ButtonComponent } from "../../base/button/button.component";
import { SelectComponent } from "../../base/select/select.component";

@Component({
  selector: 'app-field-text',
  templateUrl: './field-text.component.html',
  styleUrls: ['./field-text.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectedTemplateFieldComponent,
    ButtonComponent,
    SelectComponent
  ],
})
export class FieldTextComponent implements OnInit {
  @Input() textsOptions: IdValue[] = [];
  @Input() field!: DynamicField;
  @Input() form!: FormGroup;

  private readonly _isSelecting = signal<boolean>(false);
  private readonly _currentSelection = signal<IdValue | null>(null);

  readonly isSelecting = computed(() => this._isSelecting());
  readonly currentSelection = computed(() => this._currentSelection());
  
  readonly selectedValue = computed(() => {
    const id = this.form.get(this.field.name)?.value;
    const selected = this.textsOptions.find((opt) => opt.id === id);
    return selected?.value ?? '';
  });

  ngOnInit() {
    if (!this.field.size) {
      this.field.size = DynamicFieldSize.Regular;
    }
  }

  startSelecting() {
    this._isSelecting.set(true);
  }

  saveSelection() {
    const currentSelection = this.currentSelection();
    if (currentSelection) {
      this.form.get(this.field.name)?.setValue(currentSelection.id);
    }
    this._isSelecting.set(false);
  }
}
