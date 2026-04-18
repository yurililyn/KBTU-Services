import { TestBed } from '@angular/core/testing';

import { ServicepostService } from './servicepost.service';

describe('ServicepostService', () => {
  let service: ServicepostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicepostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
