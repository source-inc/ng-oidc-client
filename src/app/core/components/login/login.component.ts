import { Component, OnInit } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private oidcFacade: OidcFacade) {}

  ngOnInit() {}

  loginPopup() {
    this.oidcFacade.signinPopup({ state: true });
  }

  logoutPopup() {
    this.oidcFacade.signoutPopup();
  }

  loginRedirect() {
    this.oidcFacade.signinRedirect({ state: { isPopup: true } });
  }

  logoutRedirect() {
    this.oidcFacade.signoutRedirect();
  }
}
