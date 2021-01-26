import { TestBed } from '@angular/core/testing';

import { GenerateRoutineService } from './generate-routine.service';

describe('GenerateRoutineService', () => {
  let service: GenerateRoutineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateRoutineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
