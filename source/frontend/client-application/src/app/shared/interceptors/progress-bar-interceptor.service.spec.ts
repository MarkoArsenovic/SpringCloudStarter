import { TestBed } from '@angular/core/testing';

import { ProgressBarInterceptorService } from './progress-bar-interceptor.service';

describe('ProgressBarInterceptorService', () => {
  let service: ProgressBarInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressBarInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
