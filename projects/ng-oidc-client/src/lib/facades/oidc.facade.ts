import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User as OidcUser } from 'oidc-client';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as oidcActions from '../actions/oidc.action';
import { OidcEvent } from '../models';
import * as fromOidc from '../reducers/oidc.reducer';
import { OidcService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class OidcFacade {
  constructor(private store: Store<fromOidc.AuthState>, private oidcService: OidcService) {
    this.registerDefaultEvents();
  }

  loading$ = this.store.select(fromOidc.getOidcLoading);
  identity$ = this.store.select(fromOidc.getOidcIdentity);

  private addUserUnLoaded = function() {
    this.onUserUnloaded();
  }.bind(this);

  private accessTokenExpired = function(e) {
    console.log('addAccessTokenExpired', e);
  }.bind(this);

  private accessTokenExpiring = function(e) {
    console.log('addAccessTokenExpiring', e);
  }.bind(this);

  private addSilentRenewError = function(e) {
    console.log('addAccessTokenExpired', e);
  }.bind(this);

  private addUserLoaded = function(loadedUser: OidcUser) {
    this.onUserLoaded(loadedUser);
  }.bind(this);

  private addUserSignedOut = function() {
    this.onUserSignedOut();
    this.oidcService.removeUser();
  }.bind(this);

  waitForAuthenticationLoaded(): Observable<boolean> {
    return this.loading$.pipe(
      filter(loading => loading === false),
      take(1)
    );
  }

  getOidcUser() {
    this.store.dispatch(new oidcActions.GetOidcUser());
  }

  onUserLoaded(user) {
    this.store.dispatch(new oidcActions.OnUserLoaded(user));
  }

  onUserUnloaded() {
    this.store.dispatch(new oidcActions.OnUserUnloaded());
  }

  onUserSignedOut() {
    this.store.dispatch(new oidcActions.OnUserSignedOut());
  }

  onSilentRenewError(e) {
    this.store.dispatch(new oidcActions.SilentRenewError(e));
  }

  signinPopup(extraQueryParams?: any) {
    this.oidcService.signinPopup(extraQueryParams);
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

  registerEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    this.oidcService.registerOidcEvent(event, callback);
  }

  getSignoutUrl(args?: any) {
    return this.oidcService.getSignoutUrl(args);
  }

  private registerDefaultEvents() {
    // add simple loggers
    this.oidcService.registerOidcEvent(OidcEvent.AccessTokenExpired, this.accessTokenExpired);
    this.oidcService.registerOidcEvent(OidcEvent.AccessTokenExpiring, this.accessTokenExpiring);
    this.oidcService.registerOidcEvent(OidcEvent.SilentRenewError, this.addSilentRenewError);

    this.oidcService.registerOidcEvent(OidcEvent.UserLoaded, this.addUserLoaded);
    this.oidcService.registerOidcEvent(OidcEvent.UserUnloaded, this.addUserUnLoaded);
    this.oidcService.registerOidcEvent(OidcEvent.UserSignedOut, this.addUserSignedOut);
  }
}
