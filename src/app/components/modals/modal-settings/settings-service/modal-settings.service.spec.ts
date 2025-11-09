import { TestBed } from '@angular/core/testing';

import { ModalSettingsService } from './modal-settings.service';

describe('ModalSettingsService', () => {
  let service: ModalSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
