import { TestBed } from '@angular/core/testing';

import { ProtectedLayoutService } from './protected-layout.service';

describe('ProtectedLayoutService', () => {
  let service: ProtectedLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtectedLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
