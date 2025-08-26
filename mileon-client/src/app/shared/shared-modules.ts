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
import { BaseComponent } from '../components/shared/base/base.component';
import { RadioButtonComponent } from '../components/shared/base/radio-button/radio-button.component';
import { RedLineErrorComponent } from '../components/shared/errors/red-line-error/red-line-error.component';
import { FileUploadNewComponent } from '../components/shared/base/upload-files/upload-files.component';
import { DocumentPreviewNewComponent } from '../components/shared/base/document-preview-new/document-preview-new.component';
import { InputTextComponent } from '../components/shared/base/inputs/input-text/input-text.component';
import { SearchBarComponent } from '../components/shared/search-bar/search-bar.component';
import { SelectComponent } from '../components/shared/base/select/select.component';
import { AdvancedSearchComponent } from '../components/shared/advanced-search/advanced-search.component';
import { GenericModalComponent } from '../components/shared/generic-modal/generic-modal.component';
import { InputCheckboxOptionGroupComponent } from '../components/shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { InputDateComponent } from '../components/shared/base/inputs/input-date/input-date.component';
import { InputPhoneComponent } from '../components/shared/base/inputs/input-phone/input-phone.component';
import { InputCheckboxComponent } from '../components/shared/base/inputs/input-checkbox/input-checkbox.component';

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
  RadioButtonComponent,
  RedLineErrorComponent,
  FileUploadNewComponent,
  DocumentPreviewNewComponent,
  InputTextComponent,
  SearchBarComponent,
  SelectComponent,
  AdvancedSearchComponent,
  GenericModalComponent,
  InputCheckboxOptionGroupComponent,
  InputDateComponent,
  InputPhoneComponent,
  InputCheckboxComponent,
  InputCheckboxOptionGroupComponent,
];
