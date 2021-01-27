import { Component, Input, OnChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-routine-countdown',
  templateUrl: './routine-countdown.component.html',
  styleUrls: ['./routine-countdown.component.scss'],
})
export class RoutineCountdownComponent implements OnChanges {
  @Input() millisecondsRemaining = 0;

  @Input() totalMillieconds = 0;

  get secondsRemaining(): number {
    return Math.trunc(this.millisecondsRemaining / 1000);
  }

  chartDatasets: ChartDataSets[] = [];

  chartOptions: ChartOptions = {
    responsive: true,
    hover: {
      mode: undefined,
    },
    tooltips: {
      enabled: false,
    },
    animation: {
      duration: 0,
    },
  };

  constructor() {}

  ngOnChanges(): void {
    this.chartDatasets = [
      {
        data: [
          this.millisecondsRemaining,
          this.totalMillieconds - this.millisecondsRemaining,
        ],
        borderWidth: 0,
        backgroundColor: ['green', '#fafafa'],
      },
    ];
  }
}
