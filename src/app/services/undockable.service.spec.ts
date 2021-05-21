import { TestBed } from '@angular/core/testing';

import { UndockableService } from './undockable.service';

describe('UndockableService', () => {
  let service: UndockableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UndockableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
