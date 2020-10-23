import { TestBed } from '@angular/core/testing';

import { GlobalHttpErrorInterceptorService } from './global-http-error-interceptor.service';

describe('GlobalHttpErrorInterceptorService', () => {
  let service: GlobalHttpErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalHttpErrorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
