import { TestBed } from '@angular/core/testing';

import { MicroservicesService } from './microservices.service';

describe('MicroservicesService', () => {
  let service: MicroservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
