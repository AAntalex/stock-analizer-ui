import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {from, of} from 'rxjs';
import {catchError, map, mergeMap, toArray} from 'rxjs/internal/operators';
import {HttpParams} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {ProgressService} from './progress.service';
declare var require: any;
const moment = require('moment/moment')

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dateFormat = 'YYYYMMDDHHmmss';
  constructor(private rest: RestService, private progress: ProgressService) { }

  public init() {
    return this.rest.getRestEndpoint('stock/init');
  }

  public getData(secClass: string, dateBegin: Date, dateEnd?: Date, stockClass?: string, approximation?: string) {
    let params = new HttpParams()
      .set("secClass", secClass)
      .set("sDateBegin", moment(dateBegin).format(this.dateFormat))
      .set("sDateEnd", dateEnd ? moment(dateEnd).format(this.dateFormat) : '')
      .set("stockClass", stockClass)
      .set("approximation", approximation)
    ;
    this.progress.show();
    return this.rest.getRestEndpoint('stock/charts', params)
      .pipe(
        catchError(err => of([])),
        finalize(() => this.progress.hide()),
        mergeMap(resp => from(resp)),
        map(a => { return a as any; }),
        toArray()
      );
  }

  public getClasses() {
    return this.rest.getRestEndpoint('stock/classes')
      .pipe(
        catchError(err => of([])),
        mergeMap(resp => from(resp)),
        map(a => { return a as any; }),
        toArray()
      );
  }

}
