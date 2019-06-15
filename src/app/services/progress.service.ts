import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  isProgress = new Subject<boolean>();

  constructor() { }

  public show() {
    this.isProgress.next(true);
  }

  public hide() {
    this.isProgress.next(false);
  }
}
