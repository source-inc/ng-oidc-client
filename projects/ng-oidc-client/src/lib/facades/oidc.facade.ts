import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OidcClient, SigninRequest, SignoutRequest, User as OidcUser, UserManager } from 'oidc-client';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { OidcActions } from '../actions';
import { OidcEvent, RequestArugments } from '../models';
import * as fromOidc from '../reducers/oidc.reducer';
import { OidcService } from '../services/oidc.service';

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
    this.store.dispatch(new OidcActions.OnUserUnloaded());
  }.bind(this);

  private accessTokenExpired = function(e) {
    this.store.dispatch(new OidcActions.OnAccessTokenExpired());
  }.bind(this);

  private accessTokenExpiring = function() {
    this.store.dispatch(new OidcActions.OnAccessTokenExpiring());
  }.bind(this);

  private addSilentRenewError = function(e) {
    this.store.dispatch(new OidcActions.OnSilentRenewError(e));
  }.bind(this);

  private addUserLoaded = function(loadedUser: OidcUser) {
    this.store.dispatch(new OidcActions.OnUserLoaded(loadedUser));
  }.bind(this);

  private addUserSignedOut = function() {
    this.oidcService.removeOidcUser();
    this.store.dispatch(new OidcActions.OnUserSignedOut());
  }.bind(this);

  private addUserSessionChanged = function(e) {
    this.store.dispatch(new OidcActions.OnSessionChanged());
  };

  // OIDC Methods

  getOidcUser(args?: any) {
    this.store.dispatch(new OidcActions.GetOidcUser(args));
  }

  removeOidcUser() {
    this.store.dispatch(new OidcActions.RemoveOidcUser());
  }

  getUserManager(): UserManager {
    return this.oidcService.getUserManager();
  }

  getOidcClient(): OidcClient {
    return this.oidcService.getOidcClient();
  }

  /**
   * Convenient function to wait for loaded.
   */
  waitForAuthenticationLoaded(): Observable<boolean> {
    return this.loading$.pipe(
      filter(loading => loading === false),
      take(1)
    );
  }

  signinPopup(args?: RequestArugments) {
    this.store.dispatch(new OidcActions.SigninPopup(args));
  }

  signinRedirect(args?: RequestArugments) {
    this.store.dispatch(new OidcActions.SigninRedirect(args));
  }

  signinSilent(args?: RequestArugments) {
    this.store.dispatch(new OidcActions.SigninSilent(args));
  }

  signoutPopup(args?: RequestArugments) {
    this.store.dispatch(new OidcActions.SignoutPopup(args));
  }

  signoutRedirect(args?: RequestArugments) {
    this.store.dispatch(new OidcActions.SignoutRedirect(args));
  }

  getSigninUtrl(args?: RequestArugments): Observable<SigninRequest> {
    return this.oidcService.getSigninUrl(args);
  }

  getSignoutUrl(args?: RequestArugments): Observable<SignoutRequest> {
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
