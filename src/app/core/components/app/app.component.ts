import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';
import { User } from 'oidc-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'ng-oidc-client-app';
  configured$: Observable<boolean>;
  identity$: Observable<User>;
  loading$: Observable<boolean>;
  expiring$: Observable<boolean>;
  expired$: Observable<boolean>;
  loggedIn$: Observable<boolean>;
  errors$: Observable<any>;

  constructor(private oidcFacade: OidcFacade) {
    this.configured$ = this.oidcFacade.configured$;
    this.loading$ = this.oidcFacade.loading$;
    this.expiring$ = this.oidcFacade.expiring$;
    this.expired$ = this.oidcFacade.expired$;
    this.loggedIn$ = this.oidcFacade.loggedIn$;
    this.errors$ = this.oidcFacade.errors$;
    this.identity$ = this.oidcFacade.identity$;
  }

  ngOnInit() {
    // Example loading config from app component.
    // this.oidcFacade.configureOidcClient(oidcConfigSettings);
    this.oidcFacade.getOidcUser();
  }

  logoutPopup() {
    this.oidcFacade.signoutPopup();
  }

  logoutRedirect() {
    this.oidcFacade.signoutRedirect();
  }
}
