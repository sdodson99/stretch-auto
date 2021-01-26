import { Component, OnInit } from '@angular/core';
import { GenerateRoutineService } from '../generate-routine.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-start-routine',
  templateUrl: './quick-start-routine.component.html',
  styleUrls: ['./quick-start-routine.component.scss'],
})
export class QuickStartRoutineComponent implements OnInit {
  startRoutineForm = this.fb.group({
    amount: [
      this.generateRoutineService.routineConfiguration.stretchAmount,
      [Validators.min(1), Validators.required],
    ],
    duration: [
      this.generateRoutineService.routineConfiguration.stretchDurationSeconds,
      [Validators.min(1), Validators.required],
    ],
  });

  constructor(
    private generateRoutineService: GenerateRoutineService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  start(): void {
    const { amount, duration } = this.startRoutineForm.value;

    this.generateRoutineService.routineConfiguration = {
      stretchAmount: amount,
      stretchDurationSeconds: duration,
    };

    this.router.navigate(['routine', 'preview']);
  }
}
