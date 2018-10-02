import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Oidc from 'oidc-client';
import {
  OidcClient,
  SigninRequest,
  User as OidcUser,
  UserManager,
  UserManagerSettings,
  WebStorageStateStore,
  SignoutRequest
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

  private useSigninPopup = true;
  private useSignoutPopup = false;

  constructor(private route: ActivatedRoute, @Inject(OIDC_CONFIG) private config: Config) {
    Oidc.Log.level = Oidc.Log.DEBUG;
    Oidc.Log.logger = console;

    const clientSettings = this.getClientSettings();
    this.oidcUserManager = new UserManager(clientSettings);
    this.oidcClient = new OidcClient(clientSettings);
  }

  registerOidcEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    switch (event) {
      case OidcEvent.AccessTokenExpired:
        this.oidcUserManager.events.addAccessTokenExpired(callback);
        break;
      case OidcEvent.AccessTokenExpiring:
        this.oidcUserManager.events.addAccessTokenExpiring(callback);
        break;
      case OidcEvent.SilentRenewError:
        this.oidcUserManager.events.addSilentRenewError(callback);
        break;
      case OidcEvent.UserLoaded:
        this.oidcUserManager.events.addUserLoaded(callback);
        break;
      case OidcEvent.UserSessionChanged:
        this.oidcUserManager.events.addUserSessionChanged(callback);
        break;
      case OidcEvent.UserSignedOut:
        this.oidcUserManager.events.addUserSignedOut(callback);
        break;
      case OidcEvent.UserUnloaded:
        this.oidcUserManager.events.addUserUnloaded(callback);
        break;
      default:
        break;
    }
  }

  removeOidcEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    switch (event) {
      case OidcEvent.AccessTokenExpired:
        this.oidcUserManager.events.removeAccessTokenExpired(callback);
        break;
      case OidcEvent.AccessTokenExpiring:
        this.oidcUserManager.events.removeAccessTokenExpiring(callback);
        break;
      case OidcEvent.SilentRenewError:
        this.oidcUserManager.events.removeSilentRenewError(callback);
        break;
      case OidcEvent.UserLoaded:
        this.oidcUserManager.events.removeUserLoaded(callback);
        break;
      case OidcEvent.UserSessionChanged:
        this.oidcUserManager.events.removeUserSessionChanged(callback);
        break;
      case OidcEvent.UserSignedOut:
        this.oidcUserManager.events.removeUserSignedOut(callback);
        break;
      case OidcEvent.UserUnloaded:
        this.oidcUserManager.events.removeUserUnloaded(callback);
        break;
      default:
        break;
    }
  }

  getOidcUser(): Observable<OidcUser> {
    return from(this.oidcUserManager.getUser());
  }

  signinPopup(extraQueryParams?: any): Observable<OidcUser> {
    if (extraQueryParams) {
      const params = {
        extraQueryParams: extraQueryParams
      };
      return from(this.oidcUserManager.signinPopup(params));
    }
    return from(this.oidcUserManager.signinPopup());
  }

  signinRedirect(extraQueryParams?: any): Observable<OidcUser> {
    if (extraQueryParams) {
      const params = {
        extraQueryParams: extraQueryParams
      };
      return from(this.oidcUserManager.signinRedirect(params));
    }
    return from(this.oidcUserManager.signinRedirect());
  }

  signoutRedirect(args?: any): Observable<any> {
    return from(this.oidcUserManager.signoutRedirect(args));
  }

  signoutPopup(args?: any): Observable<any> {
    return from(this.oidcUserManager.signoutPopup(args));
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

  getSigninUrl(args?: any): Observable<SigninRequest> {
    return from(this.oidcUserManager.createSigninRequest(args));
  }

  getSignoutUrl(args?: any): Observable<SignoutRequest> {
    return from(this.oidcUserManager.createSignoutRequest(args));
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
      // metadata: {
      //   authorization_endpoint: 'https://ng-oidc-client.auth0.com/authorize',
      //   issuer: 'https://ng-oidc-client.auth0.com/',
      //   token_endpoint: 'https://ng-oidc-client.auth0.com/oauth/token',
      //   jwks_uri: 'https://ng-oidc-client.auth0.com/.well-known/jwks.json',
      //   userinfo_endpoint: 'https://ng-oidc-client.auth0.com/userinfo',
      //   mfa_challenge_endpoint: 'https://ng-oidc-client.auth0.com/mfa/challenge',
      //   registration_endpoint: 'https://ng-oidc-client.auth0.com/oidc/register',
      //   revocation_endpoint: 'https://ng-oidc-client.auth0.com/oauth/revoke',
      //   end_session_endpoint:
      //     `https://ng-oidc-client.auth0.com/v2/logout?` +
      //     `returnTo=http%3A%2F%2Flocalhost%3A4200%2Fsignout-callback.html&client_id=ZKGJvKHLI7KYsjBP9HZFXPF4dX3TA6Eq`
      // }
    } as UserManagerSettings;

    return settings;
  }
}
