import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Routine from '../../models/routine';
import Stretch from '../../models/stretch';
import { LiveRoutineService } from '../live-routine.service';
import { RoutineService } from '../routine.service';

@Component({
  selector: 'app-live-routine',
  templateUrl: './live-routine.component.html',
  styleUrls: ['./live-routine.component.scss'],
})
export class LiveRoutineComponent implements OnInit, OnDestroy {
  hasStretches = true;
  isComplete = false;

  currentStretch: Stretch | undefined;
  currentSecondsRemaining = 0;
  stretchSecondsDuration = 0;

  liveRoutineSubscription: Subscription | undefined;

  constructor(private liveRoutineService: LiveRoutineService) {}

  ngOnInit(): void {
    this.startRoutine();
  }

  ngOnDestroy(): void {
    this.liveRoutineSubscription?.unsubscribe();
  }

  async startRoutine(): Promise<void> {
    this.liveRoutineSubscription = this.liveRoutineService
      .getLiveRoutine$()
      .subscribe({
        next: (s) => {
          this.currentStretch = s.stretch;
          this.currentSecondsRemaining = s.secondsRemaining;
          this.stretchSecondsDuration = s.totalSeconds;
        },
        complete: () => {
          this.isComplete = true;
        },
      });
  }
}
