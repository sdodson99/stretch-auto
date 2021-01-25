import { TestBed } from '@angular/core/testing';

import { LiveRoutineService } from './live-routine.service';

describe('LiveRoutineService', () => {
  let service: LiveRoutineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveRoutineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
