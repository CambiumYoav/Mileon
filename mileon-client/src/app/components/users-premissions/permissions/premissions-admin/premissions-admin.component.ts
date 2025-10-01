import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../permissions.service';
import { PremissionsManagementTableComponent } from "../premissions-management-table/premissions-management-table.component";

@Component({
  selector: 'app-premissions-admin',
  templateUrl: './premissions-admin.component.html',
  styleUrls: ['./premissions-admin.component.scss'],
  imports: [CommonModule, PremissionsManagementTableComponent],
})
export class PremissionsAdminComponent {
  private permissionsService = inject(PermissionsService);
  
  // Signals
  groupId = signal(1); // admin
  data = computed(() => this.permissionsService.modules());
  isLoading = computed(() => this.permissionsService.isLoading());
  hasError = computed(() => this.permissionsService.hasError());
  errorMessage = computed(() => this.permissionsService.errorMessage());

  constructor() {
    // Load data when component initializes
    effect(() => {
      this.loadData();
    });
  }

  async loadData() {
    await this.permissionsService.loadModules(this.groupId());
  }
  trackByFn(index: number, item: any): any {
    return item.moduleId || index; // Use a unique identifier for modules
  }

  onModulePermissionChange(event: any) {
    console.log(event);
    // Update the permission in the service
    this.permissionsService.updateModulePermission(event.moduleId, event.permission, event.value);
  }
}
