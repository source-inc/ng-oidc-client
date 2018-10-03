import { Component } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';
import { User } from 'oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-oidc-client-app';
  user: User;

  constructor(private oidcFacade: OidcFacade) {
    this.oidcFacade.getOidcUser();
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
