import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';
import { User } from 'oidc-client';
import { Observable } from 'rxjs';
import { Identity } from 'projects/ng-oidc-client/src/lib/graphql/generated/graphql';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'ng-oidc-client-app';
  identity$: Observable<Identity.Identity>;
  loading$: Observable<boolean>;
  expiring$: Observable<boolean>;
  expired$: Observable<boolean>;
  loggedIn$: Observable<boolean>;
  errors$: Observable<any>;

  constructor(private oidcFacade: OidcFacade) {
    this.loading$ = this.oidcFacade.loading$;
    this.expiring$ = this.oidcFacade.expiring$;
    this.expired$ = this.oidcFacade.expired$;
    this.loggedIn$ = this.oidcFacade.loggedIn$;
    this.errors$ = this.oidcFacade.errors$;
    this.identity$ = this.oidcFacade.identity$;
  }

  ngOnInit() {
    this.oidcFacade.getOidcUser();
  }

  logoutPopup() {
    this.oidcFacade.signoutPopup();
  }

  logoutRedirect() {
    this.oidcFacade.signoutRedirect();
  }
}
