import { TestBed } from '@angular/core/testing';

import { ModalsOpenService } from './modals-open.service';

describe('ModalsOpenService', () => {
  let service: ModalsOpenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalsOpenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
