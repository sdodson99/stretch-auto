import { Component, OnInit } from '@angular/core';
import Routine from '../models/routine';
import { RoutineService } from '../services/routine.service';

@Component({
  selector: 'app-live-routine',
  templateUrl: './live-routine.component.html',
  styleUrls: ['./live-routine.component.scss']
})
export class LiveRoutineComponent implements OnInit {

  hasNoStretches = false;
  isLoadingRoutine = true;

  constructor(private routineService: RoutineService) { }

  ngOnInit(): void {
    this.routineService.getRountine().subscribe(routine => this.startRoutine(routine));
  }

  startRoutine(routine: Routine): void {
    this.isLoadingRoutine = false;

    if (routine.stretches.length === 0) {
      this.hasNoStretches = true;
      return;
    }
  }
}
