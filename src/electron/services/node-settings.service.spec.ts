import { TestBed } from '@angular/core/testing';

import { NodeSettingsService } from './node-settings.service';

describe('NodeSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeSettingsService = TestBed.inject(NodeSettingsService);
    expect(service).toBeTruthy();
  });
});
