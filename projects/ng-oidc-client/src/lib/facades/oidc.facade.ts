import { Injectable } from '@angular/core';
import { Loona } from '@loona/angular';
import { OidcClient, SigninRequest, SignoutRequest, User as OidcUser, UserManager } from 'oidc-client';
import { Observable } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';
import { OidcActions } from '../actions';
import { OidcEvent, RequestArugments } from '../models';
import { OidcService } from '../services/oidc.service';
import { IdentityGQL, NgOidcInfoGQL } from '../graphql/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class OidcFacade {
  loading$: Observable<boolean>; // this.store.select(fromOidc.getOidcLoading);
  expiring$: Observable<boolean>; // this.store.select(fromOidc.isIdentityExpiring);
  expired$: Observable<boolean> = null; // this.store.select(fromOidc.isIdentityExpired);
  loggedIn$: Observable<boolean>; // this.store.select(fromOidc.isLoggedIn);
  // identity$: Observable<OidcUser> = null; // this.store.select(fromOidc.getOidcIdentity);
  identity$: Observable<any>;
  // errors$: Observable<fromOidc.ErrorState> = null; // this.store.select(fromOidc.selectOidcErrorState);

  constructor(
    private loona: Loona,
    private oidcService: OidcService,
    private identityGQL: IdentityGQL,
    private ngOidcInfoGQL: NgOidcInfoGQL
  ) {
    this.registerDefaultEvents();

    const queryRefIdentity = this.loona.query<any>(this.identityGQL.document);
    const queryRefInfo = this.loona.query<any>(this.ngOidcInfoGQL.document);

    this.identity$ = queryRefIdentity.valueChanges.pipe(
      // tap(query => console.log({ query })),
      map(query => query.data.identity)
    );

    this.loading$ = queryRefIdentity.valueChanges.pipe(map(query => query.loading));

    this.loggedIn$ = queryRefIdentity.valueChanges.pipe(map(query => query.data.identity != null));

    this.expiring$ = queryRefInfo.valueChanges.pipe(
      tap(x => console.log(x)),
      map(query => query.data.expiring)
    );
  }

  // default bindings to events
  private addUserUnLoaded = function() {
    this.loona.dispatch(new OidcActions.OnUserUnloaded());
  }.bind(this);

  private accessTokenExpired = function(e) {
    this.loona.dispatch(new OidcActions.OnAccessTokenExpired());
  }.bind(this);

  private accessTokenExpiring = function() {
    console.log('access token expiring');
    this.loona.dispatch(new OidcActions.OnAccessTokenExpiring());
  }.bind(this);

  private addSilentRenewError = function(e) {
    this.loona.dispatch(new OidcActions.OnSilentRenewError(e));
  }.bind(this);

  private addUserLoaded = function(loadedUser: OidcUser) {
    // this.loona.dispatch(new OidcActions.OnUserLoaded(loadedUser));
    this.loona.dispatch(new OidcActions.UserFound(loadedUser));
  }.bind(this);

  private addUserSignedOut = function() {
    this.oidcService.removeOidcUser();
    this.loona.dispatch(new OidcActions.OnUserSignedOut());
  }.bind(this);

  private addUserSessionChanged = function(e) {
    this.loona.dispatch(new OidcActions.OnSessionChanged());
  };

  // OIDC Methods

  getOidcUser(args?: any) {
    this.loona.dispatch(new OidcActions.GetOidcUser(args));
  }

  removeOidcUser() {
    this.loona.dispatch(new OidcActions.RemoveOidcUser());
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
    // this.loona.dispatch(new OidcActions.SigninPopup(args));
    this.oidcService.signInPopup(args).pipe(tap(identity => console.log(identity)));
  }

  signinRedirect(args?: RequestArugments) {
    this.loona.dispatch(new OidcActions.SigninRedirect(args));
  }

  signinSilent(args?: RequestArugments) {
    this.loona.dispatch(new OidcActions.SigninSilent(args));
  }

  signoutPopup(args?: RequestArugments) {
    this.loona.dispatch(new OidcActions.SignoutPopup(args));
  }

  signoutRedirect(args?: RequestArugments) {
    this.loona.dispatch(new OidcActions.SignoutRedirect(args));
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
