import { TestBed } from '@angular/core/testing';

import { QueryserviceService } from './queryservice.service';

describe('QueryserviceService', () => {
  let service: QueryserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
