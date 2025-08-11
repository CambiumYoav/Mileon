import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../base/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
const MODULES = [ButtonComponent];
@NgModule({
  declarations: [...MODULES],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbNavModule,
    RouterModule,
    // NgImageSliderModule, // 19 doesnt have version
    DragDropModule,
  ],
  exports: [...MODULES, DragDropModule],
})
export class SharedModule {}
