import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, timer } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import LiveRoutineStretch from '../models/live-routine-stretch';
import Routine from '../models/routine';
import Stretch from '../models/stretch';
import NoRoutineError from './errors/no-routine-error';
import NoStretchesError from './errors/no-stretches-error';

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

  /**
   * Get an observable for a live routine.
   * @throws {NoRoutineError} Thrown if no routine has been configured.
   * @throws {NoStretchError} Thrown if routine has no stretches.
   * @returns The observable to hook into the live routine.
   */
  getLiveRoutine$(): Observable<LiveRoutineStretch> {
    if (!this._currentRoutine) {
      throw new NoRoutineError();
    }

    if (
      !this._currentRoutine.stretches ||
      this._currentRoutine.stretches.length === 0
    ) {
      throw new NoStretchesError();
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
