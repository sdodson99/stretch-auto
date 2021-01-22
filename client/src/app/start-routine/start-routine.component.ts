import { Component, OnInit } from '@angular/core';
import Stretch from '../models/stretch';
import { RoutineService } from '../services/routine.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-start-routine',
  templateUrl: './start-routine.component.html',
  styleUrls: ['./start-routine.component.scss']
})
export class StartRoutineComponent implements OnInit {

  stretches: Stretch[] = [];

  startRoutineForm = this.fb.group({
    amount: [3, [Validators.min(1), Validators.required]],
    duration: [30, [Validators.min(1), Validators.required]]
  });

  constructor(private routineService: RoutineService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  start(): void {
    const {amount, duration } = this.startRoutineForm.value;

    this.routineService.configureRoutine(amount, duration);
  }
}
