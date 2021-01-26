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

    const routine = this.preprocessRoutine(this._currentRoutine);

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

  private preprocessRoutine(routine: Routine): Routine {
    const processedStretches = [];

    for (const stretch of routine.stretches) {
      stretch.instructions?.sort((a, b) => a.order - b.order);

      if (stretch.isUnilateral) {
        const unilateralStretches: Stretch[] = ['Left', 'Right'].map((side) => {
          return {
            id: stretch.id,
            name: `${side} ${stretch.name}`,
            isUnilateral: true,
            instructions: stretch.instructions,
          };
        });
        processedStretches.push(...unilateralStretches);
      } else {
        processedStretches.push(stretch);
      }
    }

    routine.stretches = processedStretches;

    return routine;
  }

  private toLiveRoutineStretch(
    stretches: Stretch[],
    stretchDuration: number
  ): OperatorFunction<number, LiveRoutineStretch> {
    return map((value: number) => {
      return {
        stretch: stretches[Math.trunc(value / stretchDuration)],
        secondsRemaining: stretchDuration - (value % stretchDuration),
        totalSeconds: stretchDuration,
      };
    });
  }
}
