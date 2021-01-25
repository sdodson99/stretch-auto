import { Observable, OperatorFunction, timer } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import LiveRoutineStretch from './live-routine-stretch';
import Routine from './routine';
import Stretch from './stretch';

class LiveRoutine {
  constructor(private routine: Routine) {
    const processedStretches = [];

    for (const stretch of this.routine.stretches) {
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

    this.routine.stretches = processedStretches;
  }

  getRoutine$(): Observable<LiveRoutineStretch> {
    return timer(0, 1000).pipe(
      takeWhile(
        (i) =>
          i <
          this.routine.stretchSecondsDuration * this.routine.stretches.length
      ),
      this.toRoutineStretch(
        this.routine.stretches,
        this.routine.stretchSecondsDuration
      )
    );
  }

  private toRoutineStretch(
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

export default LiveRoutine;
