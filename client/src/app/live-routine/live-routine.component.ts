import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import LiveRoutine, { LiveRoutineEvent } from '../models/live-routine';
import Routine from '../models/routine';
import Stretch from '../models/stretch';
import { RoutineService } from '../services/routine.service';

@Component({
  selector: 'app-live-routine',
  templateUrl: './live-routine.component.html',
  styleUrls: ['./live-routine.component.scss'],
})
export class LiveRoutineComponent implements OnInit {
  hasStretches = false;
  isComplete = false;

  startRoutine$: Observable<Promise<void>>;

  currentStretch: Stretch | undefined;
  currentSecondsRemaining = 0;
  stretchSecondsDuration = 0;

  constructor(private routineService: RoutineService) {
    this.startRoutine$ = this.routineService
      .getRoutine()
      .pipe(map((routine) => this.startRoutine(routine)));
  }

  ngOnInit(): void {}

  async startRoutine(routine: Routine): Promise<void> {
    if (routine.stretches.length === 0) {
      return;
    }

    this.hasStretches = true;
    this.stretchSecondsDuration = routine.stretchSecondsDuration;

    const liveRoutine = new LiveRoutine(routine);

    liveRoutine.subscribe(LiveRoutineEvent.StretchChanged, () => {
      this.currentStretch = liveRoutine.currentStretch;
    });

    liveRoutine.subscribe(
      LiveRoutineEvent.StretchRemainingSecondsChanged,
      () => {
        this.currentSecondsRemaining =
          liveRoutine.currentStretchRemainingSeconds;
      }
    );

    await liveRoutine.start();

    this.isComplete = true;
  }
}
