import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgressComponent } from './components/shared/progress/progress.component';
import { ProgressService } from './services/progress.service';
import { MaterialModule } from './material.module';
import { ErrorDialogService } from './error-dialog/error-dialog.service';
import { HttpErrorInterceptor } from './iterceptor/httperror.interceptor';
import { CandleStickComponent } from './charts/candle-stick/candle-stick.component';


@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent,
    CandleStickComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [
    ErrorDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    ProgressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
