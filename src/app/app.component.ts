import { Component } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-oidc-client-app';

  constructor(private oidcFacade: OidcFacade) {
    this.oidcFacade.getOidcUser();
  }

  login() {
    this.oidcFacade.signinPopup();
  }

  logout() {
    // this.oidcFacade.signoutPopup();
    this.oidcFacade.getSignoutUrl().subscribe(url => console.log(url));
  }
}
