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
