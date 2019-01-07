import { Injectable } from '@angular/core';
import { Loona } from '@loona/angular';
import { OidcClient, SigninRequest, SignoutRequest, User as OidcUser, UserManager } from 'oidc-client';
import { Observable, of, throwError } from 'rxjs';
import { filter, take, map, tap, pluck, catchError, concatMap } from 'rxjs/operators';
import { OidcActions } from '../actions';
import { OidcEvent, RequestArugments } from '../models';
import { OidcService } from '../services/oidc.service';
import { IdentityGQL, NgOidcInfoGQL, NgOidcInfo, Identity, UpdateNgOidcInfoGQL } from '../graphql/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class OidcFacade {
  loading$: Observable<boolean>; // this.store.select(fromOidc.getOidcLoading);
  expiring$: Observable<boolean>; // this.store.select(fromOidc.isIdentityExpiring);
  expired$: Observable<boolean>; // this.store.select(fromOidc.isIdentityExpired);
  loggedIn$: Observable<boolean>; // this.store.select(fromOidc.isLoggedIn);
  // identity$: Observable<OidcUser> = null; // this.store.select(fromOidc.getOidcIdentity);
  identity$: Observable<OidcUser>;
  errors$: Observable<any>; // this.store.select(fromOidc.selectOidcErrorState);

  _info$: Observable<NgOidcInfo.NgOidcInfo>;
  _identity$: Observable<any>;

  constructor(
    private loona: Loona,
    private oidcService: OidcService,
    private identityGQL: IdentityGQL,
    private ngOidcInfoGQL: NgOidcInfoGQL,
    private updateNgOidInfoGQL: UpdateNgOidcInfoGQL
  ) {
    this.registerDefaultEvents();

    const queryRefIdentity = this.loona.query<any>(this.identityGQL.document);
    this._identity$ = queryRefIdentity.valueChanges;

    this.loggedIn$ = this._identity$.pipe(map(query => query.data.identity != null));
    this.identity$ = this._identity$.pipe(pluck('data', 'identity'));
    this.expired$ = this.identity$.pipe(map(identity => (identity && identity.expired) || false));

    const queryRefInfo = this.loona.query<any>(this.ngOidcInfoGQL.document);
    this._info$ = queryRefInfo.valueChanges.pipe(pluck('data', 'ngOidcInfo'));

    this.expiring$ = this._info$.pipe(pluck('expiring'));
    this.errors$ = this._info$.pipe(pluck('errors'));
    this.loading$ = this._info$.pipe(pluck('loading'));
  }

  // default bindings to events
  private addUserUnLoaded = function() {
    this.loona.dispatch(new OidcActions.OnUserUnloaded());
  }.bind(this);

  private accessTokenExpired = async function() {
    this.loona.dispatch(new OidcActions.OnAccessTokenExpired());
  }.bind(this);

  private accessTokenExpiring = function() {
    this.loona.dispatch(new OidcActions.OnAccessTokenExpiring(true));
  }.bind(this);

  private addSilentRenewError = async function(error) {
    this.loona.dispatch(new OidcActions.OidcError(error));
  }.bind(this);

  private addUserLoaded = function(loadedUser: OidcUser) {
    console.log('loaded');
    this.loona.dispatch(new OidcActions.UserFound(loadedUser));
  }.bind(this);

  private addUserSignedOut = function() {
    console.log('signedOut');
    this.oidcService.removeOidcUser();
    this.loona.dispatch(new OidcActions.OnUserSignedOut());
  }.bind(this);

  private addUserSessionChanged = function(e) {
    console.log('sessionchanged');
    this.loona.dispatch(new OidcActions.OnSessionChanged());
  };

  // OIDC Methods

  getOidcUser(args?: any) {
    console.log('getOidcUser');
    this.oidcService
      .getOidcUser()
      .pipe(
        tap((userData: OidcUser) => {
          // user expired, initiate silent sign-in if configured to automatic
          if (userData != null && userData.expired === true && this.oidcService.silentRenewEnabled()) {
            this.oidcService.signInSilent(args);
          }
          this.loona.dispatch(new OidcActions.UserFound(userData));
        })
      )
      .subscribe();
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
    this.oidcService
      .signInPopup(args)
      .pipe(
        catchError(error => {
          this.loona.dispatch(new OidcActions.OidcError(error));
          return [];
        })
      )
      .subscribe();
  }

  signinRedirect(args?: RequestArugments) {
    this.oidcService
      .signInRedirect(args)
      .pipe(
        catchError(error => {
          this.loona.dispatch(new OidcActions.OidcError(error));
          return [];
        })
      )
      .subscribe();
  }

  signinSilent(args?: RequestArugments) {
    this.oidcService
      .signInSilent(args)
      .pipe(
        catchError(error => {
          this.loona.dispatch(new OidcActions.OidcError(error));
          return [];
        })
      )
      .subscribe();
  }

  signoutPopup(args?: RequestArugments) {
    this.oidcService
      .signOutPopup(args)
      .pipe(
        catchError(error => {
          this.loona.dispatch(new OidcActions.OidcError(error));
          return [];
        })
      )
      .subscribe();
  }

  signoutRedirect(args?: RequestArugments) {
    this.oidcService
      .signOutRedirect(args)
      .pipe(
        catchError(error => {
          this.loona.dispatch(new OidcActions.OidcError(error));
          return [];
        })
      )
      .subscribe();
  }

  getSigninUtrl(args?: RequestArugments): Observable<SigninRequest> {
    return this.oidcService.getSigninUrl(args).pipe(
      catchError(error => {
        this.loona.dispatch(new OidcActions.OidcError(error));
        return [];
      })
    );
  }

  getSignoutUrl(args?: RequestArugments): Observable<SignoutRequest> {
    return this.oidcService.getSignoutUrl(args).pipe(
      catchError(error => {
        this.loona.dispatch(new OidcActions.OidcError(error));
        return [];
      })
    );
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
