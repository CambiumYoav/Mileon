import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { InfrastructureFormComponent } from '../components/infrastractures/infrastructure-form/infrastructure-form.component';
import { InfrastructureImportComponent } from '../components/infrastractures/infrastructure-import/infrastructure-import.component';
import { DynamicRow } from '../types/infrastructure/InfrastructureTypes';
import { InfrastructureExportComponent } from '../components/infrastractures/infrastructure-export/infrastructure-export.component';
import { InfrastructureTablesTypes } from '../types/enum/infrastructureTablesEnum';

export interface InfrastructureComponentConfig {
  component: InfrastructureComponentType;
  data?: any;
  config?: MatDialogConfig;
}

export type InfrastructureComponentType = 
  | 'form' 
  | 'import' 
  | 'export'

export interface InfrastructureFormData {
  form: DynamicRow[];
  title: string;
  isEdit: boolean;
  isSigns: boolean;
}

export interface InfrastructureImportData {
  description: string;
  isSignsImport?: boolean;
  isSpecialImport?: boolean;
}

export interface InfrastructureExportData {
  description: string;
  isSignsExport?: boolean;
  isSpecialExport?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {
  form(form: any, Street: InfrastructureTablesTypes) {
    throw new Error('Method not implemented.');
  }
  openInfrastructureExport(data: InfrastructureExportData, customConfig?: MatDialogConfig): MatDialogRef<any> {
    return this.openInfrastructureComponent({
      component: 'export',
      data,
      config: customConfig
    });
  }
  
  private readonly componentMap: Record<InfrastructureComponentType, Type<any>> = {
      form: InfrastructureFormComponent,
      import: InfrastructureImportComponent,
      export: InfrastructureExportComponent,
  };


  constructor(private dialog: MatDialog) {}

  /**
   * Opens an infrastructure component as a popup
   * @param config Configuration for the component to open
   * @returns MatDialogRef for the opened dialog
   */
  openInfrastructureComponent(config: InfrastructureComponentConfig): MatDialogRef<any> {
    const componentType = config.component;
    const component = this.componentMap[componentType];
    
    if (!component) {
      throw new Error(`Unknown infrastructure component type: ${componentType}`);
    }
    const finalConfig = config.config ? { ...config.config } : {};
    
    if (config.data) {
      finalConfig.data = config.data;
    }

    return this.dialog.open(component, finalConfig);
  }

  /**
   * Opens infrastructure form component
   * @param data Form configuration data
   * @param customConfig Optional custom dialog configuration
   * @returns MatDialogRef for the opened dialog
   */
  openInfrastructureForm(data: InfrastructureFormData, customConfig?: MatDialogConfig): MatDialogRef<any> {
    return this.openInfrastructureComponent({
      component: 'form',
      data,
      config: customConfig
    });
  }

  /**
   * Opens infrastructure import component
   * @param data Import configuration data
   * @param customConfig Optional custom dialog configuration
   * @returns MatDialogRef for the opened dialog
   */
  openInfrastructureImport(data: InfrastructureImportData, customConfig?: MatDialogConfig): MatDialogRef<any> {
    return this.openInfrastructureComponent({
      component: 'import',
      data,
      config: customConfig
    });
  }


  /**
   * Closes all open infrastructure dialogs
   */
  closeAllInfrastructureDialogs(): void {
    this.dialog.closeAll();
  }

  /**
   * Gets the component class for a given infrastructure component type
   * @param componentType The type of infrastructure component
   * @returns The component class
   */
  getComponentClass(componentType: InfrastructureComponentType): Type<any> {
    const component = this.componentMap[componentType];
    if (!component) {
      throw new Error(`Unknown infrastructure component type: ${componentType}`);
    }
    return component;
  }
}
