import { Component } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';
import { User } from 'oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private oidcFacade: OidcFacade) {
    this.oidcFacade.getOidcUser();
  }
}
