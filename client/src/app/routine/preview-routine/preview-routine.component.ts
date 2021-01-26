import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable, Subscription, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import Routine from '../../models/routine';
import { LiveRoutineService } from '../live-routine.service';
import { RoutineService } from '../routine.service';

@Component({
  selector: 'app-preview-routine',
  templateUrl: './preview-routine.component.html',
  styleUrls: ['./preview-routine.component.scss'],
})
export class PreviewRoutineComponent implements OnInit, OnDestroy {
  routine: Routine | undefined;
  isLoading = true;
  isRefreshing = true;

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
    this.isRefreshing = true;
    this.getRoutine();
  }

  getRoutine(): void {
    this.getRoutineSubscription?.unsubscribe();

    this.getRoutineSubscription = combineLatest([
      this.routineService.getRoutine(),
      timer(100),
    ]).subscribe((routine) => {
      this.routine = routine[0];
      this.isLoading = false;
      this.isRefreshing = false;
    });
  }
}
