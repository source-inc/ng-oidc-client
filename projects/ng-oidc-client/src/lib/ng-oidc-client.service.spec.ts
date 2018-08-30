import { TestBed, inject } from '@angular/core/testing';

import { NgOidcClientService } from './ng-oidc-client.service';

describe('NgOidcClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgOidcClientService]
    });
  });

  it('should be created', inject([NgOidcClientService], (service: NgOidcClientService) => {
    expect(service).toBeTruthy();
  }));
});
