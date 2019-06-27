import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  isProgress = new Subject<boolean>();
  activeProgress = false;

  constructor() { }

  public show() {
    if (this.activeProgress) {
      this.isProgress.next(true);
    }
  }

  public hide() {
    this.activeProgress = false;
    this.isProgress.next(false);
  }

  public activation() {
    this.activeProgress = true;
  }
  public isActive() {
    return this.activeProgress;
  }
}
