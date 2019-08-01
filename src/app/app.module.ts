import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgressComponent } from './components/shared/progress/progress.component';
import { ToggleButtonComponent } from './components/shared/toggles-button/toggle-button.component';
import { DateTimePickerComponent } from './components/shared/date-time-picker/date-time-picker.component';
import { ProgressService } from './services/progress.service';
import { MaterialModule } from './material.module';
import { ErrorDialogService } from './error-dialog/error-dialog.service';
import { HttpErrorInterceptor } from './iterceptor/httperror.interceptor';
import { CandleStickComponent } from './charts/candle-stick/candle-stick.component';
import { AutocompleteComponent } from './components/shared/autocomplete/autocomplete.component';

import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent,
    ToggleButtonComponent,
    DateTimePickerComponent,
    CandleStickComponent,
    AutocompleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AngularDateTimePickerModule,
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ErrorDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    ProgressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
