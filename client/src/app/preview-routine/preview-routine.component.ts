import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import Routine from '../models/routine';
import { LiveRoutineService } from '../services/live-routine.service';
import { RoutineService } from '../services/routine.service';

@Component({
  selector: 'app-preview-routine',
  templateUrl: './preview-routine.component.html',
  styleUrls: ['./preview-routine.component.scss'],
})
export class PreviewRoutineComponent implements OnInit, OnDestroy {
  routine: Routine | undefined;
  isLoading = true;

  getRoutineSubscription: Subscription | undefined;

  constructor(
    private routineService: RoutineService,
    private liveRoutineService: LiveRoutineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRoutine();
  }

  ngOnDestroy(): void {
    this.getRoutineSubscription?.unsubscribe();
  }

  startRoutine(): void {
    this.liveRoutineService.currentRoutine = this.routine;
    this.router.navigate(['routine', 'live']);
  }

  refreshRoutine(): void {
    this.getRoutine();
  }

  getRoutine(): void {
    this.isLoading = true;

    this.getRoutineSubscription?.unsubscribe();

    this.getRoutineSubscription = this.routineService
      .getRoutine()
      .subscribe((routine) => {
        this.routine = routine;
        this.isLoading = false;
      });
  }
}
