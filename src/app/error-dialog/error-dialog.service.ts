import { Injectable, InjectionToken, Injector } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ErrorDialogComponent } from './error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  constructor(private snackbar: MatSnackBar, private dialog: MatDialog) { }

  public openDialog(data): void {
     const dialogRef = this.dialog.open(ErrorDialogComponent, {
       role: 'dialog',
       width: '30%',
       data: data
     });
   // this.snackbar.openFromComponent(ErrorDialogComponent, {duration: 20000, data: data, verticalPosition: "top"});
  }
}
