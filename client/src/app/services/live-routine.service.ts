import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, timer } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import LiveRoutineStretch from '../models/live-routine-stretch';
import Routine from '../models/routine';
import Stretch from '../models/stretch';

@Injectable({
  providedIn: 'root',
})
export class LiveRoutineService {
  private _currentRoutine: Routine | undefined;

  get currentRoutine(): Routine | undefined {
    return this._currentRoutine;
  }

  set currentRoutine(routine: Routine | undefined) {
    this._currentRoutine = routine;
  }

  constructor() {}

  getLiveRoutine$(): Observable<LiveRoutineStretch> {
    if (!this._currentRoutine) {
      throw new Error('No routine configured.');
    }

    const routine = this._currentRoutine;

    const routineDuration =
      routine.stretchSecondsDuration * routine.stretches.length;

    return timer(0, 1000).pipe(
      takeWhile((i) => i < routineDuration),
      this.toLiveRoutineStretch(
        routine.stretches,
        routine.stretchSecondsDuration
      )
    );
  }

  private toLiveRoutineStretch(
    stretches: Stretch[],
    stretchDuration: number
  ): OperatorFunction<number, LiveRoutineStretch> {
    return map((value: number) => {
      return {
        stretch: stretches[Math.trunc(value / stretchDuration)],
        secondsRemaining: stretchDuration - (value % stretchDuration),
      };
    });
  }
}
