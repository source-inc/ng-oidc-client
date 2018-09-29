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

  waitForAuthenticationLoaded(): Observable<boolean> {
    return this.loading$.pipe(
      filter(loading => loading === false),
      take(1)
    );
  }

  getOidcUser() {
    this.store.dispatch(new oidcActions.GetOidcUser());
  }

  signInSilent() {
    this.store.dispatch(new oidcActions.SignInSilent());
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

  signin() {
    this.oidcService.signin();
  }

  registerEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    this.oidcService.registerOidcEvent(event, callback);
  }

  private registerDefaultEvents() {
    this.oidcService.registerOidcEvent(OidcEvent.AccessTokenExpired, this.accessTokenExpired);
    this.oidcService.registerOidcEvent(OidcEvent.AccessTokenExpiring, this.accessTokenExpiring);
    this.oidcService.registerOidcEvent(OidcEvent.SilentRenewError, this.addSilentRenewError);
    this.oidcService.registerOidcEvent(OidcEvent.UserLoaded, this.addUserLoaded);
    this.oidcService.registerOidcEvent(OidcEvent.UserUnloaded, this.addUserUnLoaded);
    this.oidcService.registerOidcEvent(OidcEvent.UserSignedOut, this.addUserSignedOut);
  }

  private accessTokenExpired(e) {
    console.log('addAccessTokenExpired', e);
  }

  private accessTokenExpiring(e) {
    console.log('addAccessTokenExpiring', e);
  }

  private addSilentRenewError(e) {
    console.log('addAccessTokenExpired', e);
  }

  private addUserLoaded(loadedUser: OidcUser) {
    this.onUserLoaded(loadedUser);
  }

  private addUserUnLoaded() {
    this.onUserUnloaded();
  }

  private addUserSignedOut() {
    this.onUserSignedOut();
    this.oidcService.removeUser();
  }
}
