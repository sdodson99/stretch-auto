import { Component, OnInit } from '@angular/core';
import Routine from '../models/routine';
import Stretch from '../models/stretch';
import { RoutineService } from '../services/routine.service';

@Component({
  selector: 'app-live-routine',
  templateUrl: './live-routine.component.html',
  styleUrls: ['./live-routine.component.scss']
})
export class LiveRoutineComponent implements OnInit {

  hasNoStretches = false;
  isLoadingRoutine = true;
  isComplete = false;

  currentStretch: Stretch | undefined;
  currentSecondsRemaining = 0;

  constructor(private routineService: RoutineService) { }

  ngOnInit(): void {
    this.routineService.getRountine().subscribe(routine => this.startRoutine(routine));
  }

  async startRoutine(routine: Routine): Promise<void> {
    this.isLoadingRoutine = false;

    if (routine.stretches.length === 0) {
      this.hasNoStretches = true;
      return;
    }

    for (const stretch of routine.stretches) {
      for (let remainingSeconds = routine.stretchSecondsDuration; remainingSeconds >= 0; remainingSeconds--) {
        this.currentStretch = stretch;
        this.currentSecondsRemaining = remainingSeconds;

        await this.setTimeoutAsync(1000);
      }
    }

    this.isComplete = true;
  }

  setTimeoutAsync(duration: number): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, duration);
    });
  }
}
