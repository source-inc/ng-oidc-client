import { Component, OnInit } from '@angular/core';
import { User } from 'oidc-client';
import { OidcFacade } from 'ng-oidc-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'ng-oidc-client-app';
  user: User;
  loading$;

  constructor(private oidcFacade: OidcFacade) {
    this.oidcFacade.getOidcUser();
    this.loading$ = this.oidcFacade.loading$;
    this.oidcFacade.identity$.subscribe(user => {
      this.user = user;
    });
  }

  loginPopup() {
    this.oidcFacade.signinPopup();
  }

  logoutPopup() {
    this.oidcFacade.signoutPopup();
  }

  loginRedirect() {
    this.oidcFacade.signinRedirect();
  }

  logoutRedirect() {
    this.oidcFacade.signoutRedirect();
  }
}
