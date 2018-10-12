import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User as OidcUser, SignoutRequest, SigninRequest } from 'oidc-client';
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
  loggedIn$: Observable<boolean> = this.store.select(fromOidc.isLoggedIn);
  identity$: Observable<OidcUser> = this.store.select(fromOidc.getOidcIdentity);
  errors$: Observable<fromOidc.ErrorState> = this.store.select(fromOidc.selectOidcErrorState);

  // default bindings to events
  private addUserUnLoaded = function() {
    console.log('user loaded');
    this.store.dispatch(new OidcActions.OnUserUnloaded());
  }.bind(this);

  private accessTokenExpired = function(e) {
    console.log('addAccessTokenExpired', e);
    this.store.dispatch(new OidcActions.OnAccessTokenExpired());
  }.bind(this);

  private accessTokenExpiring = function() {
    console.log('addAccessTokenExpiring');
    this.store.dispatch(new OidcActions.OnAccessTokenExpiring());
  }.bind(this);

  private addSilentRenewError = function(e) {
    console.log('addAccessTokenExpired', e);
    console.log(typeof e);
    this.store.dispatch(new OidcActions.OnSilentRenewError(e));
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
    this.store.dispatch(new OidcActions.OnSessionChanged());
  };

  // OIDC Methods

  getOidcUser(args?: any) {
    this.store.dispatch(new OidcActions.GetOidcUser(args));
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

  signinPopup(args?: any) {
    this.store.dispatch(new OidcActions.SigninPopup(args));
  }

  signinRedirect(args?: any) {
    this.store.dispatch(new OidcActions.SigninRedirect(args));
  }

  signinSilent(args?: any) {
    this.store.dispatch(new OidcActions.SigninSilent(args));
  }

  signoutPopup(args?: any) {
    this.store.dispatch(new OidcActions.SignoutPopup(args));
  }

  signoutRedirect(args?: any) {
    this.store.dispatch(new OidcActions.SignoutRedirect(args));
  }

  getSigninUrl(args?: any): Observable<SigninRequest> {
    return this.oidcService.getSigninUrl(args);
  }

  getSignoutUrl(args?: any): Observable<SignoutRequest> {
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
