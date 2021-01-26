import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription, timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Routine from '../../models/routine';
import { GenerateRoutineService } from '../generate-routine.service';
import { CurrentRoutineService } from '../current-routine.service';

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
    private routineService: GenerateRoutineService,
    private currentRoutineService: CurrentRoutineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.currentRoutineService.currentRoutine) {
      this.getRoutine();
    } else {
      this.routine = this.currentRoutineService.currentRoutine;
      this.isLoading = false;
      this.isRefreshing = false;
    }
  }

  ngOnDestroy(): void {
    this.getRoutineSubscription?.unsubscribe();
  }

  startRoutine(): void {
    this.currentRoutineService.currentRoutine = this.routine;
    this.router.navigate(['routine', 'live']);
  }

  refreshRoutine(): void {
    this.isRefreshing = true;
    this.getRoutine();
  }

  getRoutine(): void {
    this.getRoutineSubscription?.unsubscribe();

    this.getRoutineSubscription = combineLatest([
      this.routineService.generateRoutine(),
      timer(100),
    ])
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.isRefreshing = false;
        })
      )
      .subscribe((routine) => {
        this.routine = routine[0];
      });
  }
}
