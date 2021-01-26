import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Stretch from '../models/stretch';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Response from '../models/response';
import Routine from '../models/routine';
import RoutineConfiguration from '../models/routine-configuration';
import { CurrentRoutineService } from './current-routine.service';

@Injectable({
  providedIn: 'root',
})
export class GenerateRoutineService {
  private baseUrl;

  private _routineConfiguration: RoutineConfiguration;

  get routineConfiguration(): RoutineConfiguration {
    return this._routineConfiguration;
  }

  set routineConfiguration(value: RoutineConfiguration) {
    this.currentRoutineService.clearRoutine();
    this._routineConfiguration = value;
  }

  constructor(
    private http: HttpClient,
    private currentRoutineService: CurrentRoutineService
  ) {
    this.baseUrl = environment.baseAPIUrl;

    this._routineConfiguration = {
      stretchAmount: 3,
      stretchDurationSeconds: 30,
    };
  }

  generateRoutine(): Observable<Routine> {
    return this.getRoutineStretches().pipe(
      map((response) => {
        if (response.error) {
          throw new Error('Failed to get stretches.');
        }

        return {
          stretchSecondsDuration: this.routineConfiguration
            .stretchDurationSeconds,
          stretches: response.data,
        };
      })
    );
  }

  private getRoutineStretches(): Observable<Response<Stretch[]>> {
    const params = new HttpParams().set(
      'maxAmount',
      this.routineConfiguration.stretchAmount.toString()
    );

    return this.http.get<Response<Stretch[]>>(this.baseUrl + 'stretch', {
      params,
    });
  }
}
