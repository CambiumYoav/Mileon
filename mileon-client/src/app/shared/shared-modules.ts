import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../components/shared/base/button/button.component';
import { MaterialModule } from './material-module';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from '../components/shared/table/table.component';
import { ActiveComponent } from '../components/shared/base/active/active.component';
import { HeaderComponent } from '../components/header/header.component';
import { CheckboxComponent } from '../components/shared/base/checkbox/checkbox.component';
import { BaseComponent } from '../components/shared/base/base.componenet';
export const SharedModules = [CommonModule, RouterOutlet];

export const SharedImports = [
  FormsModule,
  ReactiveFormsModule,
  NgbModule,
  DragDropModule,
  NgbNavModule,
  ...SharedModules,
  ...MaterialModule,
];
export const SharedComponents = [HeaderComponent];

export const BaseComponents = [
  BaseComponent,
  ButtonComponent,
  TableComponent,
  ActiveComponent,
  CheckboxComponent,
  BaseComponent
];
