import { TestBed } from '@angular/core/testing';

import { CurrentRoutineService } from './current-routine.service';

describe('CurrentRoutineService', () => {
  let service: CurrentRoutineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentRoutineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
