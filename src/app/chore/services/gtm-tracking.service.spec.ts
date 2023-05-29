import { TestBed } from '@angular/core/testing';

import { GtmTrackingService } from './gtm-tracking.service';

describe('GtmTrackingService', () => {
  let service: GtmTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GtmTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
