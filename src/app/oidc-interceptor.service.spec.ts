import { TestBed } from '@angular/core/testing';

import { OidcInterceptorService } from './oidc-interceptor.service';

describe('OidcInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OidcInterceptorService = TestBed.get(OidcInterceptorService);
    expect(service).toBeTruthy();
  });
});
