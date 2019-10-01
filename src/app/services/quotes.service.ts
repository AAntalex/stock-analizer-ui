import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  isActive = false;
  quotes = new Subject<any>();

  currentQuotes = this.quotes.asObservable();

  constructor() { }

  public show() {
    this.isActive = true;
  }

  public hide() {
    this.isActive = false;
  }

  public setQuotes(quotes: any) {
    if (this.isActive) {
      this.quotes.next(quotes);
    }
  }

}
