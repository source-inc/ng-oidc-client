import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'oidc-client';
import { OidcFacade } from 'ng-oidc-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  title = 'ng-oidc-client-app';
  identity$: Observable<User>;
  loggedIn$: Observable<boolean>;

  constructor(private oidcFacade: OidcFacade) {
    this.loggedIn$ = this.oidcFacade.loggedIn$;
    this.identity$ = this.oidcFacade.identity$;
  }
}
