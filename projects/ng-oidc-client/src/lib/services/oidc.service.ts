import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Oidc from 'oidc-client';
import {
  OidcClient,
  SigninRequest,
  User as OidcUser,
  UserManager,
  UserManagerSettings,
  WebStorageStateStore
} from 'oidc-client';
import { from, Observable } from 'rxjs';
import { Config, OidcEvent, OIDC_CONFIG } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OidcService {
  private oidcUserManager: UserManager;
  private oidcClient: OidcClient;
  private oidcUser: OidcUser;

  // private oidcUserSubject: BehaviorSubject<OidcUser> = new BehaviorSubject(null);
  private useSigninPopup = true;
  private useSignoutPopup = false;

  constructor(private route: ActivatedRoute, @Inject(OIDC_CONFIG) private config: Config) {
    Oidc.Log.level = Oidc.Log.INFO;
    Oidc.Log.logger = console;

    const clientSettings = this.getClientSettings();
    this.oidcUserManager = new UserManager(clientSettings);
    this.oidcClient = new OidcClient(clientSettings);
  }

  registerOidcEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    this.oidcUserManager.events[event](callback);
  }

  getOidcUser(): Observable<OidcUser> {
    return from(this.oidcUserManager.getUser());
  }

  signin(inviteCode?: string): Observable<OidcUser> {
    const params = {
      extraQueryParams: inviteCode ? { invite_code: inviteCode } : {}
    };
    if (this.useSigninPopup) {
      return from(this.oidcUserManager.signinPopup(params));
    }
    return from(this.oidcUserManager.signinRedirect(params));
  }

  signout(): Observable<OidcUser> {
    if (this.useSignoutPopup) {
      return from(this.oidcUserManager.signoutPopup());
    }
    return from(this.oidcUserManager.signoutRedirect());
  }

  signinSilent(): Observable<OidcUser> {
    return from(this.oidcUserManager.signinSilent());
  }

  signinPopupCallback(): Observable<any> {
    return from(this.oidcUserManager.signinPopupCallback());
  }

  signinRedirectCallback(): Observable<OidcUser> {
    return from(this.oidcUserManager.signinRedirectCallback());
  }

  signoutPopupCallback(): Observable<void> {
    return from(this.oidcUserManager.signoutPopupCallback());
  }

  signoutRedirectCallback(): Observable<any> {
    return from(this.oidcUserManager.signoutRedirectCallback());
  }

  getSigninUrl(): Observable<SigninRequest> {
    return from(this.oidcUserManager.createSigninRequest());
  }

  removeUser(): Promise<void> {
    return this.oidcUserManager.removeUser();
  }

  private getClientSettings(): UserManagerSettings {
    const settings = {
      authority: this.config.environment.urls.authority,
      client_id: this.config.environment.client.id,
      redirect_uri: this.config.environment.urls.redirect_uri,
      post_logout_redirect_uri: this.config.environment.urls.post_logout_redirect_uri,
      response_type: 'id_token token',
      scope: this.config.environment.client.scope,
      silent_redirect_uri: this.config.environment.urls.silent_redirect_uri,
      automaticSilentRenew: this.config.automaticSilentRenew,
      accessTokenExpiringNotificationTime: this.config.accessTokenExpiringNotificationTime,
      filterProtocolClaims: this.config.filterProtocolClaims,
      loadUserInfo: this.config.loadUserInfo,
      userStore: new WebStorageStateStore({ store: window.localStorage })
    } as UserManagerSettings;

    return settings;
  }
}
