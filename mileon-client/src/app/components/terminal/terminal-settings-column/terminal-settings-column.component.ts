import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DynamicField } from '../../../types/infrastructure/InfrastructureTypes';
import { ColumnTypeEnum } from '../../../types/table';
import { TerminalSettingsResponse } from '../../../types/terminal/terminalSettingsRequestType';
import { SelectComponent } from '../../shared/base/select/select.component';
import { RadioButtonComponent } from '../../shared/base/radio-button/radio-button.component';

@Component({
  selector: 'app-terminal-settings-column',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, SelectComponent, RadioButtonComponent],
  templateUrl: './terminal-settings-column.component.html',
  styleUrls: ['./terminal-settings-column.component.scss'],
})
export class TerminalSettingsColumnComponent {
  fields = input<any[]>([]);
  columnTitle = input<string>('');
  form = input.required<FormGroup>();
  labelColumn = input<string[]>([]);
  last = input<boolean>(false);
  fieldUpdate = output<{ key: string; value: any }>();

  ColumnTypeEnum = ColumnTypeEnum;

  onFieldChange(field: any, value: any): void {
    this.fieldUpdate.emit({ key: field.id || field.name, value });
  }

  onInputChange(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onDropdownChange(event: Event): any {
    const select = event.target as HTMLSelectElement;
    return select ? select.value : '';
  }
}
