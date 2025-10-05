import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormComponent } from '../../../../components/shared/base-form/base-form.component';   
import { ConstPath } from '../../../../constants/const_path';
import { TableErrors } from '../../../../constants/errors';
import { ColumnTypeEnum } from '../../../../types/table';
import { CheckboxComponent } from "../../../shared/base/checkbox/checkbox.component";
import { RedLineErrorComponent } from "../../../shared/errors/red-line-error/red-line-error.component";

@Component({
  selector: 'app-premissions-management-table',
  templateUrl: './premissions-management-table.component.html',
  styleUrls: ['./premissions-management-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CheckboxComponent, RedLineErrorComponent],
})
export class PremissionsManagementTableComponent extends BaseFormComponent {
  data = input.required<any[]>();
  
  onIconClick = output<any>();
  onModulePermissionChange = output<any>();

  errorMsg = computed(() => {
    const dataValue = this.data();
    return dataValue.length === 0 ? TableErrors.NOT_FOUND : '';
  });

  ColumnTypeEnum = ColumnTypeEnum;
  Icons = ConstPath;

  processedData = computed(() => {
    const dataValue = this.data();
    return dataValue.map((item) => ({
      ...item,
      isExpanded: item.isExpanded || false,
    }));
  });

  constructor() {
    super();
  }

  onIconClickEvent(item: any): void {
    item.isIconToggled = !item.isIconToggled;

    // isIconToggled=true -> add user
    // isIconToggled=false -> remove user
    this.onIconClick.emit(item);
  }

  toggleAccordion(module: any): void {
    module.isExpanded = !module.isExpanded;
  }

  // onPermissionChange(module: any, permission: 'canRead' | 'canWrite'): void {
  //   module[permission] = !module[permission];
  //   console.log(`Updated ${permission} for module`, module);
  //   this.onModulePermissionChange.emit({ module, permission });
  // }
  onPermissionChange(module: any, permission: 'canRead' | 'canWrite'): void {
    module[permission] = !module[permission]; // Toggle the permission
  
    console.log(`Updated ${permission} for moduleId: ${module.moduleId}`);
    
    // Emit only the moduleId and the updated permission
    this.onModulePermissionChange.emit({
      moduleId: module.moduleId,
      permission: permission,
      value: module[permission],
    });
  }
  
}
