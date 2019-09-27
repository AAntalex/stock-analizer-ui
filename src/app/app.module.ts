import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgressService } from './services/progress.service';
import { MaterialModule } from './material.module';
import { HttpErrorInterceptor } from './helpers/httperror.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LoginComponent } from './login/login.component';
import { CandleStickComponent } from './charts/candle-stick/candle-stick.component';
import { QuotesChartComponent } from './charts/quotes-chart/quotes-chart.component';
import { AutocompleteComponent } from './components/shared/autocomplete/autocomplete.component';
import { AppSidenavComponent } from './components/shared/app-sidenav/sidenav.component';
import { ModalNotificationService } from './modalNotifications/modal.notification.service';
import { ModalNotificationComponent } from './modalNotifications/modal.notification.component';
import { CdkDragDropComponent } from './components/shared/cdk-drag-drop/cdk-drag-drop.component';
import { ProgressComponent } from './components/shared/progress/progress.component';
import { ToggleButtonComponent } from './components/shared/toggles-button/toggle-button.component';
import { DateTimePickerComponent } from './components/shared/date-time-picker/date-time-picker.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent,
    ToggleButtonComponent,
    DateTimePickerComponent,
    CandleStickComponent,
    AutocompleteComponent,
    AppSidenavComponent,
    QuotesChartComponent,
    LoginComponent,
    ModalNotificationComponent,
    CdkDragDropComponent,
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
    DragDropModule,
  ],
  providers: [
    ProgressService,
    FormBuilder,
    ModalNotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  entryComponents: [
    ModalNotificationComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
