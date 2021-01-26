import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Stretch from '../../models/stretch';
import NoRoutineError from '../errors/no-routine-error';
import NoStretchesError from '../errors/no-stretches-error';
import { LiveRoutineService } from '../live-routine.service';

@Component({
  selector: 'app-live-routine',
  templateUrl: './live-routine.component.html',
  styleUrls: ['./live-routine.component.scss'],
})
export class LiveRoutineComponent implements OnInit, OnDestroy {
  hasStretches = true;
  hasRoutine = true;
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

  startRoutine(): void {
    try {
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

      this.hasRoutine = true;
      this.hasStretches = true;
    } catch (error) {
      if (error instanceof NoRoutineError) {
        this.hasRoutine = false;
      } else if (error instanceof NoStretchesError) {
        this.hasStretches = false;
      } else {
        throw error;
      }
    }
  }
}
