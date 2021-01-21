import { TestBed } from '@angular/core/testing';

import { StretchService } from './stretch.service';

describe('StretchService', () => {
  let service: StretchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StretchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
