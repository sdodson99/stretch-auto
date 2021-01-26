import { Injectable } from '@angular/core';
import Routine from '../models/routine';

@Injectable({
  providedIn: 'root',
})
export class CurrentRoutineService {
  private _currentRoutine: Routine | undefined;

  get currentRoutine(): Routine | undefined {
    return this._currentRoutine;
  }

  set currentRoutine(routine: Routine | undefined) {
    this._currentRoutine = routine;
  }

  constructor() {}

  clearRoutine(): void {
    this._currentRoutine = undefined;
  }
}
