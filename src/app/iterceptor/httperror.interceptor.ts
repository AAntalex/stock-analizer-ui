import { Injectable } from '@angular/core';
import { ErrorDialogService } from '../error-dialog/error-dialog.service';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProgressService } from '../services/progress.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(public errorDialogService: ErrorDialogService, private progress: ProgressService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.addHeaders(request);
        return next.handle(request)
            .pipe(
                map((event: HttpEvent<any>) => {
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    console.error(error);
                    this.errorDialogService.openDialog({
                        reason: error.message,
                        status: error.status
                    });
                    return throwError(error);
                }),
            );
    }

    private addHeaders(request: HttpRequest<any>) {
        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    }
}
