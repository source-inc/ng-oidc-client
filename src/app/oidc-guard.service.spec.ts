import { TestBed } from '@angular/core/testing';

import { OidcGuardService } from './oidc-guard.service';

describe('OidcGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OidcGuardService = TestBed.get(OidcGuardService);
    expect(service).toBeTruthy();
  });
});
