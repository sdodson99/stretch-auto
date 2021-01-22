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

  routine: Routine | undefined;
  currentStretch: Stretch | undefined;
  _currentSecondsRemaining = 0;

  chartOptions: ChartOptions = {
    responsive: true,
    hover: {
      mode: undefined
    },
    tooltips: {
      enabled: false
    },
    animation: {
      duration: 0
    }
  };
  chartDatasets: ChartDataSets[] = [];

  constructor(private routineService: RoutineService) { }

  ngOnInit(): void {
    this.routineService.getRountine().subscribe(routine => this.startRoutine(routine));
  }

  async startRoutine(routine: Routine): Promise<void> {
    this.routine = routine;
    this.isLoadingRoutine = false;

    if (this.routine.stretches.length === 0) {
      return;
    }

    this.hasStretches = true;

    const stretches: Stretch[] = [];

    for (const stretch of this.routine.stretches) {
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
      for (let remainingSeconds = this.routine.stretchSecondsDuration; remainingSeconds >= 0; remainingSeconds--) {
        this.currentStretch = stretch;
        this.currentSecondsRemaining = remainingSeconds;

        await this.setTimeoutAsync(1000);
      }
    }

    this.isComplete = true;
  }

  set currentSecondsRemaining(seconds: number) {
    this._currentSecondsRemaining = seconds;

    if (this.routine) {
      this.chartDatasets = [{
        data: [
          this.routine.stretchSecondsDuration - this._currentSecondsRemaining,
          this._currentSecondsRemaining,
        ],
        borderWidth: 0,
        backgroundColor: [
          'lightgray',
          'green',
        ],
      }];
    }
  }

  setTimeoutAsync(duration: number): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, duration);
    });
  }
}
