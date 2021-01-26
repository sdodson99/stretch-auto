import { Component, OnInit } from '@angular/core';
import Stretch from '../models/stretch';
import { RoutineService } from '../services/routine.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-start-routine',
  templateUrl: './quick-start-routine.component.html',
  styleUrls: ['./quick-start-routine.component.scss'],
})
export class QuickStartRoutineComponent implements OnInit {
  startRoutineForm = this.fb.group({
    amount: [3, [Validators.min(1), Validators.required]],
    duration: [30, [Validators.min(1), Validators.required]],
  });

  constructor(
    private routineService: RoutineService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  start(): void {
    const { amount, duration } = this.startRoutineForm.value;

    this.routineService.configureRoutine(amount, duration);

    this.router.navigate(['routine', 'preview']);
  }
}
