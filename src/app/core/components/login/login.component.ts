import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';
import { User } from 'oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(private oidcFacade: OidcFacade) {}

  @Input()
  loggedIn: boolean;

  @Input()
  identity: User;

  ngOnInit() {}

  loginPopup() {
    this.oidcFacade.signinPopup();
  }

  loginRedirect() {
    this.oidcFacade.signinRedirect();
  }
}
