import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Stretch from '../models/stretch';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Response from '../models/response';
import Routine from '../models/routine';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private baseUrl;

  private amount = 0;
  private duration = 0;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseAPIUrl;
  }

  configureRoutine(amount: number, duration: number): void {
    this.amount = amount;
    this.duration = duration;
  }

  hasConfiguredRoutine(): boolean {
    return this.amount > 0 && this.duration > 0;
  }

  getRoutine(): Observable<Routine> {
    return this.getRoutineStretches().pipe(
      map((response) => {
        if (response.error) {
          throw new Error('Failed to get stretches.');
        }

        return {
          stretchSecondsDuration: this.duration,
          stretches: response.data,
        };
      })
    );
  }

  private getRoutineStretches(): Observable<Response<Stretch[]>> {
    const params = new HttpParams().set('maxAmount', this.amount.toString());

    return this.http.get<Response<Stretch[]>>(this.baseUrl + 'stretch', {
      params,
    });
  }
}
