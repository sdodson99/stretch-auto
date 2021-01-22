import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Stretch from '../models/stretch';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import Response from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class StretchService {
  private baseUrl;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseAPIUrl;
  }

  getStretches(amount: number): Observable<Response<Stretch[]>>{
    const params = new HttpParams().set('maxAmount', amount.toString());

    return this.http.get<Response<Stretch[]>>(this.baseUrl + 'stretch', { params });
  }
}
