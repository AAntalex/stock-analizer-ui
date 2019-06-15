import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {from, of} from 'rxjs';
import {catchError, map, mergeMap, toArray} from 'rxjs/internal/operators';
import {HttpParams} from '@angular/common/http';
declare var require: any;
const moment = require('moment/moment')

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dateFormat = 'YYYYMMDDHHmmss';
  constructor(private rest: RestService) { }
  public getData(secClass: string, dateBegin: Date, dateEnd: Date, stockClass?: string, approximation?: string) {
    let params = new HttpParams()
      .set("secClass", secClass)
      .set("sDateBegin", moment(dateBegin).format(this.dateFormat))
      .set("sDateEnd", moment(dateEnd).format(this.dateFormat))
      .set("stockClass", stockClass)
      .set("approximation", approximation)
    ;
    return this.rest.getRestEndpoint('charts', params)
      .pipe(
        catchError(err => of([])),
        mergeMap(resp => from(resp)),
        map(a => { return a as any; }),
        toArray()
      );
  }
}
