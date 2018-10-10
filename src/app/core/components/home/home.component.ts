import { Component, OnInit } from '@angular/core';
import { User } from 'oidc-client';
import { OidcFacade } from 'ng-oidc-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'ng-oidc-client-app';
  identity$: Observable<User>;
  loading$: Observable<boolean>;
  expiring$: Observable<boolean>;
  expired$: Observable<boolean>;
  errors$: Observable<any>;

  constructor(private oidcFacade: OidcFacade) {
    this.loading$ = this.oidcFacade.loading$;
    this.expiring$ = this.oidcFacade.expiring$;
    this.expired$ = this.oidcFacade.expired$;

    this.errors$ = this.oidcFacade.errors$;

    this.identity$ = this.oidcFacade.identity$;
  }
}
