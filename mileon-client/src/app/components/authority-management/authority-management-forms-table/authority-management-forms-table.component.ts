import { Component, EventEmitter, Output, signal, computed, inject, ChangeDetectionStrategy, input } from '@angular/core';
import { RedLineErrorComponent } from "../../shared/errors/red-line-error/red-line-error.component";
import { CheckboxComponent } from "../../shared/base/checkbox/checkbox.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-forms-table',
  templateUrl: './authority-management-forms-table.component.html',
  styleUrls: ['./authority-management-forms-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RedLineErrorComponent,
    CheckboxComponent,
  ],
})
export class AuthorityManagementFormsTableComponent {
  readonly data = input<any[]>([]);

  @Output() emitValues = new EventEmitter<any>();

  private readonly _updatedRows = signal<Set<any>>(new Set());
  private readonly _errorMsg = signal<string>('');
  private readonly _loader = signal<boolean>(false);
  private readonly _originalData = signal<any[]>([]);

  readonly updatedRows = computed(() => this._updatedRows());
  readonly errorMsg = computed(() => this._errorMsg());
  readonly loader = computed(() => this._loader());
  readonly originalData = computed(() => this._originalData());

  constructor() {}

  ngOnInit(): void {
    // Wait until `data` has all values (fieldNameValue included)
    setTimeout(() => {
      this._originalData.set(JSON.parse(JSON.stringify(this.data())));
    });
  }

  onCheckboxChange(row: any, checked: boolean) {
    row.isRequired = checked;
    console.log(row);
    const currentSet = new Set(this.updatedRows());
    currentSet.add(row);
    this._updatedRows.set(currentSet);
    this.emitChanges();
  }

  onInputChange(row: any, event: Event) {
    row.fieldNameValue = (event.target as HTMLInputElement).value;
    this.emitChanges();
  }

  emitChanges() {
    // Emit the full updated dataset
    console.log(this.data());
    this.emitValues.emit(this.data());
  }
}
