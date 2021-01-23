import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import Routine from '../models/routine';
import Stretch from '../models/stretch';
import { RoutineService } from '../services/routine.service';

@Component({
  selector: 'app-live-routine',
  templateUrl: './live-routine.component.html',
  styleUrls: ['./live-routine.component.scss']
})
export class LiveRoutineComponent implements OnInit {

  hasStretches = false;
  isLoadingRoutine = true;
  isComplete = false;

  currentStretch: Stretch | undefined;
  currentSecondsRemaining = 0;
  stretchSecondsDuration = 0;

  constructor(private routineService: RoutineService) { }

  ngOnInit(): void {
    this.routineService.getRountine().subscribe(routine => this.startRoutine(routine));
  }

  async startRoutine(routine: Routine): Promise<void> {
    this.isLoadingRoutine = false;

    if (routine.stretches.length === 0) {
      return;
    }

    this.hasStretches = true;
    this.stretchSecondsDuration = routine.stretchSecondsDuration;

    const stretches: Stretch[] = [];

    for (const stretch of routine.stretches) {
        stretch.instructions?.sort((a, b) => a.order - b.order);

        if (stretch.isUnilateral) {
          const unilateralStretches: Stretch[] = ['Left', 'Right'].map(side => {
            return {
              id: stretch.id,
              name: `${side} ${stretch.name}`,
              isUnilateral: true,
              instructions: stretch.instructions
            };
          });
          stretches.push(...unilateralStretches);
        } else {
          stretches.push(stretch);
        }
    }

    for (const stretch of stretches) {
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
