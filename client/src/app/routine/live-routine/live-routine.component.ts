import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  currentMillisecondsRemaining = 0;
  stretchMillisecondsDuration = 0;

  liveRoutineSubscription: Subscription | undefined;

  constructor(
    private liveRoutineService: LiveRoutineService,
    private router: Router
  ) {}

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
            this.currentMillisecondsRemaining = s.secondsRemaining * 1000;
            this.stretchMillisecondsDuration = s.totalSeconds * 1000;
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

  cancelRoutine(): void {
    this.liveRoutineSubscription?.unsubscribe();
    this.router.navigate(['routine', 'preview']);
  }
}
