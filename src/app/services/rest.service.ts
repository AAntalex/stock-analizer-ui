import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) { }

  public getRestEndpoint(endpointAdress: string, params?: HttpParams): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/' + endpointAdress, {headers: headers, params: params, reportProgress: true})
    .pipe(
      map(this.extractData)
    );
  }
 private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
