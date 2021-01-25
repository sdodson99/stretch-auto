import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Routine from '../models/routine';
import Stretch from '../models/stretch';
import { LiveRoutineService } from '../services/live-routine.service';
import { RoutineService } from '../services/routine.service';

@Component({
  selector: 'app-live-routine',
  templateUrl: './live-routine.component.html',
  styleUrls: ['./live-routine.component.scss'],
})
export class LiveRoutineComponent implements OnInit, OnDestroy {
  hasStretches = true;
  isComplete = false;

  startRoutine$: Observable<Promise<void>>;

  currentStretch: Stretch | undefined;
  currentSecondsRemaining = 0;
  stretchSecondsDuration = 0;

  liveRoutineSubscription: Subscription | undefined;

  constructor(
    private routineService: RoutineService,
    private liveRoutineService: LiveRoutineService
  ) {
    this.startRoutine$ = this.routineService.getRoutine().pipe(
      this.preprocessRoutine(),
      map((routine) => this.startRoutine(routine))
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.liveRoutineSubscription?.unsubscribe();
  }

  async startRoutine(routine: Routine): Promise<void> {
    if (routine.stretches.length === 0) {
      this.hasStretches = false;
      return;
    }

    this.stretchSecondsDuration = routine.stretchSecondsDuration;

    this.liveRoutineSubscription = this.liveRoutineService
      .getLiveRoutine$(routine)
      .subscribe({
        next: (s) => {
          this.currentStretch = s.stretch;
          this.currentSecondsRemaining = s.secondsRemaining;
        },
        error: (e) => console.log(e),
        complete: () => {
          this.isComplete = true;
        },
      });
  }

  private preprocessRoutine(): OperatorFunction<Routine, Routine> {
    return map((routine) => {
      const processedStretches = [];

      for (const stretch of routine.stretches) {
        stretch.instructions?.sort((a, b) => a.order - b.order);

        if (stretch.isUnilateral) {
          const unilateralStretches: Stretch[] = ['Left', 'Right'].map(
            (side) => {
              return {
                id: stretch.id,
                name: `${side} ${stretch.name}`,
                isUnilateral: true,
                instructions: stretch.instructions,
              };
            }
          );
          processedStretches.push(...unilateralStretches);
        } else {
          processedStretches.push(stretch);
        }
      }

      routine.stretches = processedStretches;
      return routine;
    });
  }
}
