import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User as OidcUser } from 'oidc-client';
import { Observable, of } from 'rxjs';
import { filter, take, catchError, tap } from 'rxjs/operators';
import * as oidcActions from '../actions/oidc.action';
import { OidcEvent } from '../models';
import * as fromOidc from '../reducers/oidc.reducer';
import { OidcService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class OidcFacade {
  constructor(private store: Store<fromOidc.OidcState>, private oidcService: OidcService) {
    this.registerDefaultEvents();
  }

  loading$ = this.store.select(fromOidc.getOidcLoading);
  expiring$ = this.store.select(fromOidc.isIdentityExpiring);
  expired$ = this.store.select(fromOidc.isIdentityExpired);
  identity$ = this.store.select(fromOidc.getOidcIdentity);
  errors$ = this.store.select(fromOidc.selectOidcErrorState);

  // default bindings to events
  private addUserUnLoaded = function() {
    console.log('user loaded');
    this.store.dispatch(new oidcActions.OnUserUnloaded());
  }.bind(this);

  private accessTokenExpired = function(e) {
    console.log('addAccessTokenExpired', e);
  }.bind(this);

  private accessTokenExpiring = function() {
    console.log('addAccessTokenExpiring');
    this.store.dispatch(new oidcActions.UserExpiring());
  }.bind(this);

  private addSilentRenewError = function(e) {
    console.log('addAccessTokenExpired', e);
    console.log(typeof e);
    this.store.dispatch(new oidcActions.SilentRenewError(e));
  }.bind(this);

  private addUserLoaded = function(loadedUser: OidcUser) {
    console.log('USER LOADED');
    this.store.dispatch(new oidcActions.OnUserLoaded(loadedUser));
  }.bind(this);

  private addUserSignedOut = function() {
    console.log('USER SIGNED OUT');
    this.oidcService.removeOidcUser();
    this.store.dispatch(new oidcActions.OnUserSignedOut());
  }.bind(this);

  private addUserSessionChanged = function(e) {
    console.log('USER SESSION CHANGED', e);
    this.store.dispatch(new oidcActions.SessionChanged());
  };

  // OIDC Methods

  getOidcUser() {
    this.store.dispatch(new oidcActions.GetOidcUser());
  }

  removeOidcUser() {
    this.store.dispatch(new oidcActions.RemoveOidcUser());
  }

  waitForAuthenticationLoaded(): Observable<boolean> {
    return this.loading$.pipe(
      filter(loading => loading === false),
      take(1)
    );
  }

  signinPopup(extraQueryParams?: any) {
    this.oidcService
      .signinPopup(extraQueryParams)
      .pipe(
        tap(user => console.log(user)),
        catchError(error => of(console.log(error)))
      )
      .subscribe();
  }

  signinRedirect(extraQueryParams?: any) {
    this.oidcService.signinRedirect(extraQueryParams);
  }

  signInSilent() {
    this.store.dispatch(new oidcActions.SignInSilent());
  }

  signoutPopup(args?: any) {
    this.oidcService.signoutPopup(args);
  }

  signoutRedirect(args?: any) {
    this.oidcService.signoutRedirect(args);
  }

  getSignoutUrl(args?: any) {
    return this.oidcService.getSignoutUrl(args);
  }

  registerEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    this.oidcService.registerOidcEvent(event, callback);
  }

  private registerDefaultEvents() {
    // add simple loggers
    this.oidcService.registerOidcEvent(OidcEvent.AccessTokenExpired, this.accessTokenExpired);
    this.oidcService.registerOidcEvent(OidcEvent.AccessTokenExpiring, this.accessTokenExpiring);
    this.oidcService.registerOidcEvent(OidcEvent.SilentRenewError, this.addSilentRenewError);

    this.oidcService.registerOidcEvent(OidcEvent.UserLoaded, this.addUserLoaded);
    this.oidcService.registerOidcEvent(OidcEvent.UserUnloaded, this.addUserUnLoaded);
    this.oidcService.registerOidcEvent(OidcEvent.UserSignedOut, this.addUserSignedOut);
    this.oidcService.registerOidcEvent(OidcEvent.UserSessionChanged, this.addUserSessionChanged);
  }
}
