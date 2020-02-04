import { Inject, Injectable, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { User as OidcUser } from 'oidc-client';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { OidcActions } from '../actions';
import { Config, OidcEvent, OIDC_CONFIG, RequestArugments } from '../models';
import { toSerializedUser } from '../oidc.utils';
import { ErrorState, OidcState } from '../reducers';
import { OidcSelectors } from '../selectors';
import { OidcService } from '../services/oidc.service';

@Injectable({
  providedIn: 'root'
})
export class OidcFacade {
  constructor(
    @Optional() @Inject(OIDC_CONFIG) private config: Config,
    private store: Store<OidcState>,
    private oidcService: OidcService
  ) {
    // If a configuration was injected, load it.
    if (config != null) {
      this.configureOidcClient(config);
    }
  }

  configured$: Observable<boolean> = this.store.select(OidcSelectors.getOidcConfigured);
  configurationError$: Observable<string> = this.store.select(OidcSelectors.getOidcConfigurationError);
  loading$: Observable<boolean> = this.store.select(OidcSelectors.getOidcLoading);
  identity$: Observable<OidcUser> = this.store.select(OidcSelectors.getOidcIdentity);
  expiring$: Observable<boolean> = this.store.select(OidcSelectors.isIdentityExpiring);
  expired$: Observable<boolean> = this.store.select(OidcSelectors.isIdentityExpired);
  loggedIn$: Observable<boolean> = this.store.select(OidcSelectors.isLoggedIn);
  errors$: Observable<ErrorState> = this.store.select(OidcSelectors.selectOidcErrorState);

  // default bindings to events
  private addUserUnLoaded = function() {
    this.store.dispatch(OidcActions.OnUserUnloaded());
  }.bind(this);

  private accessTokenExpired = function(e) {
    this.store.dispatch(OidcActions.OnAccessTokenExpired());
  }.bind(this);

  private accessTokenExpiring = function() {
    this.store.dispatch(OidcActions.OnAccessTokenExpiring());
  }.bind(this);

  private addSilentRenewError = function(e) {
    this.store.dispatch(OidcActions.OnSilentRenewError(e));
  }.bind(this);

  private addUserLoaded = function(loadedUser: OidcUser) {
    this.store.dispatch(OidcActions.OnUserLoaded({ payload: toSerializedUser(loadedUser) }));
  }.bind(this);

  private addUserSignedOut = function() {
    this.oidcService.removeOidcUser();
    this.store.dispatch(OidcActions.OnUserSignedOut());
  }.bind(this);

  private addUserSessionChanged = function(e) {
    this.store.dispatch(OidcActions.OnSessionChanged());
  };

  // OIDC Methods

  configureOidcClient(config: Config) {
    try {
      this.oidcService.configureClient(config);
      this.registerDefaultEvents();
      this.store.dispatch(OidcActions.ClientConfigured());
    } catch (error) {
      this.store.dispatch(OidcActions.ClientConfigError({ payload: error.toString() }));
    }
  }

  getOidcUser(args?: RequestArugments) {
    this.store.dispatch(OidcActions.GetOidcUser({ payload: args }));
  }

  removeOidcUser() {
    this.store.dispatch(OidcActions.RemoveOidcUser());
  }

  getUserManager() {
    return this.oidcService.getUserManager();
  }

  getOidcClient() {
    return this.oidcService.getOidcClient();
  }

  /**
   * Convenient function to wait for loaded.
   */
  waitForAuthenticationLoaded() {
    return this.loading$.pipe(
      filter(loading => loading === false),
      take(1)
    );
  }

  signinPopup(args?: RequestArugments) {
    this.store.dispatch(OidcActions.SigninPopup({ payload: args }));
  }

  signinRedirect(args?: RequestArugments) {
    this.store.dispatch(OidcActions.SigninRedirect({ payload: args }));
  }

  signoutRedirect(args?: RequestArugments) {
    this.store.dispatch(OidcActions.SignOutRedirect({ payload: args }));
  }

  signoutPopup(args?: RequestArugments) {
    this.store.dispatch(OidcActions.SignoutPopup({ payload: args }));
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
