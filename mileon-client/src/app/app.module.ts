import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import {
  NgbPopoverModule,
  NgbModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './components/shared/shared/shared.module';
import { MaterialModule } from './shared/material.module';

import { HttpClientModule } from '@angular/common/http';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [AppComponent],
  imports: [
    // TicketsNewModule,
    // AppRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    // SwiperModule,
    // HttpClientModule,
    NgbPopoverModule,
    NgxSliderModule,
    MaterialModule,
    NgbModule,
    NgbNavModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      enableHtml: true,
      preventDuplicates: true,
    }),
    RouterModule.forRoot([]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
