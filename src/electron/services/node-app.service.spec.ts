import { TestBed } from '@angular/core/testing';

import { NodeAppService } from './node-app.service';

describe('NodeAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeAppService = TestBed.inject(NodeAppService);
    expect(service).toBeTruthy();
  });
});
