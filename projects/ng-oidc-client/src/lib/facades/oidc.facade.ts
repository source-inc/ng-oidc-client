import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User as OidcUser } from 'oidc-client';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { OidcActions } from '../actions';
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

  loading$: Observable<boolean> = this.store.select(fromOidc.getOidcLoading);
  expiring$: Observable<boolean> = this.store.select(fromOidc.isIdentityExpiring);
  expired$: Observable<boolean> = this.store.select(fromOidc.isIdentityExpired);
  identity$: Observable<OidcUser> = this.store.select(fromOidc.getOidcIdentity);
  errors$: Observable<fromOidc.ErrorState> = this.store.select(fromOidc.selectOidcErrorState);

  // default bindings to events
  private addUserUnLoaded = function() {
    console.log('user loaded');
    this.store.dispatch(new OidcActions.OnUserUnloaded());
  }.bind(this);

  private accessTokenExpired = function(e) {
    console.log('addAccessTokenExpired', e);
  }.bind(this);

  private accessTokenExpiring = function() {
    console.log('addAccessTokenExpiring');
    this.store.dispatch(new OidcActions.UserExpiring());
  }.bind(this);

  private addSilentRenewError = function(e) {
    console.log('addAccessTokenExpired', e);
    console.log(typeof e);
    this.store.dispatch(new OidcActions.SilentRenewError(e));
  }.bind(this);

  private addUserLoaded = function(loadedUser: OidcUser) {
    console.log('USER LOADED');
    this.store.dispatch(new OidcActions.OnUserLoaded(loadedUser));
  }.bind(this);

  private addUserSignedOut = function() {
    console.log('USER SIGNED OUT');
    this.oidcService.removeOidcUser();
    this.store.dispatch(new OidcActions.OnUserSignedOut());
  }.bind(this);

  private addUserSessionChanged = function(e) {
    console.log('USER SESSION CHANGED', e);
    this.store.dispatch(new OidcActions.SessionChanged());
  };

  // OIDC Methods

  getOidcUser() {
    this.store.dispatch(new OidcActions.GetOidcUser());
  }

  removeOidcUser() {
    this.store.dispatch(new OidcActions.RemoveOidcUser());
  }

  /**
   * Convenient function to wait for loaded
   */
  waitForAuthenticationLoaded(): Observable<boolean> {
    return this.loading$.pipe(
      filter(loading => loading === false),
      take(1)
    );
  }

  signinPopup(extraQueryParams?: any) {
    this.store.dispatch(new OidcActions.SignInPopup(extraQueryParams));
  }

  signinRedirect(extraQueryParams?: any) {
    this.store.dispatch(new OidcActions.SignInRedirect(extraQueryParams));
  }

  signInSilent() {
    this.store.dispatch(new OidcActions.SignInSilent());
  }

  signoutPopup(args?: any) {
    this.oidcService.signOutPopup(args);
  }

  signoutRedirect(args?: any) {
    this.oidcService.signOutRedirect(args);
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
