import { Component, OnInit } from '@angular/core';
import Stretch from '../models/stretch';
import { StretchService } from '../services/stretch.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-stretch',
  templateUrl: './stretch.component.html',
  styleUrls: ['./stretch.component.scss']
})
export class StretchComponent implements OnInit {

  stretches: Stretch[] = [];

  startStretchingForm = this.fb.group({
    amount: [3, [Validators.min(1), Validators.required]],
    duration: [30, [Validators.min(1), Validators.required]]
  });

  constructor(private stretchService: StretchService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.stretchService.getStretches(3).subscribe(response => this.stretches = response.data);
  }

  start(): void {
    console.log('starting');
  }

}
