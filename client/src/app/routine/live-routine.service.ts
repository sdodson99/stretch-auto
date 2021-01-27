import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, timer } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import LiveRoutineStretch from '../models/live-routine-stretch';
import Routine from '../models/routine';
import Stretch from '../models/stretch';
import { CurrentRoutineService } from './current-routine.service';
import NoRoutineError from './errors/no-routine-error';
import NoStretchesError from './errors/no-stretches-error';

@Injectable({
  providedIn: 'root',
})
export class LiveRoutineService {
  private get currentRoutine(): Routine | undefined {
    return this.currentRoutineService.currentRoutine;
  }

  constructor(private currentRoutineService: CurrentRoutineService) {}

  /**
   * Get an observable for a live routine.
   * @throws {NoRoutineError} Thrown if no routine has been configured.
   * @throws {NoStretchError} Thrown if routine has no stretches.
   * @returns The observable to hook into the live routine.
   */
  getLiveRoutine$(): Observable<LiveRoutineStretch> {
    if (!this.currentRoutine) {
      throw new NoRoutineError();
    }

    const routine = this.currentRoutine;

    const hasStretches = routine.stretches && routine.stretches.length > 0;
    if (!hasStretches) {
      throw new NoStretchesError();
    }

    const routineStretches = this.processUnilateralStretches(routine.stretches);
    const routineDurationSeconds =
      routineStretches.length * routine.stretchSecondsDuration;

    return timer(0, 100).pipe(
      takeWhile((i) => i / 10 < routineDurationSeconds),
      this.toLiveRoutineStretch(
        routineStretches,
        routine.stretchSecondsDuration
      )
    );
  }

  private processUnilateralStretches(stretches: Stretch[]): Stretch[] {
    const processedStretches = [];

    for (const stretch of stretches) {
      if (stretch.isUnilateral) {
        const unilateralStretches = ['Left', 'Right'].map((side) => {
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

    return processedStretches;
  }

  private toLiveRoutineStretch(
    stretches: Stretch[],
    stretchDuration: number
  ): OperatorFunction<number, LiveRoutineStretch> {
    return map((currentTenthSecond: number) => {
      const currentSecond = currentTenthSecond / 10;
      const currentStretchIndex = Math.trunc(currentSecond / stretchDuration);
      const currentStretch = stretches[currentStretchIndex];

      return {
        stretch: currentStretch,
        secondsRemaining: stretchDuration - (currentSecond % stretchDuration),
        totalSeconds: stretchDuration,
      };
    });
  }
}
