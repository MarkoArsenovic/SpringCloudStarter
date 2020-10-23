import { TestBed } from '@angular/core/testing';

import { HttpErrorConverterService } from './http-error-converter.service';

describe('HttpErrorConverterService', () => {
  let service: HttpErrorConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
