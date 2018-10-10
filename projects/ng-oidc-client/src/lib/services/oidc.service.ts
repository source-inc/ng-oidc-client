import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Log, OidcClient, SigninRequest, SignoutRequest, User as OidcUser, UserManager } from 'oidc-client';
import { from, Observable } from 'rxjs';
import { Config, OidcEvent, OIDC_CONFIG, StorageKeys } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OidcService {
  private oidcUserManager: UserManager;
  private oidcClient: OidcClient;
  private oidcUser: OidcUser;

  constructor(
    private route: ActivatedRoute,
    @Inject(OIDC_CONFIG) private config: Config,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const { log: logSettings, oidc_config: clientSettings } = this.config;

    if (logSettings) {
      Log.level = logSettings.level;
      Log.logger = logSettings.logger;
    }

    this.oidcUserManager = new UserManager(clientSettings);
    this.oidcClient = new OidcClient(clientSettings);
  }

  getOidcUser(): Observable<OidcUser> {
    return from(this.oidcUserManager.getUser());
  }

  removeOidcUser(): Observable<void> {
    return from(this.oidcUserManager.removeUser());
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

  signInPopup(extraQueryParams?: any): Observable<OidcUser> {
    this.setCallbackInformation(true);
    if (extraQueryParams) {
      const params = {
        extraQueryParams: extraQueryParams
      };
      return from(this.oidcUserManager.signinPopup(params));
    }
    return from(this.oidcUserManager.signinPopup());
  }

  signInRedirect(extraQueryParams?: any): Observable<OidcUser> {
    this.setCallbackInformation(false);

    if (extraQueryParams) {
      const params = {
        extraQueryParams: extraQueryParams
      };
      return from(this.oidcUserManager.signinRedirect(params));
    }
    return from(this.oidcUserManager.signinRedirect());
  }

  signOutRedirect(args?: any): Observable<any> {
    this.setCallbackInformation(false);
    return from(this.oidcUserManager.signoutRedirect(args));
  }

  signOutPopup(args?: any): Observable<any> {
    this.setCallbackInformation(true);
    return from(this.oidcUserManager.signoutPopup());
  }

  signInSilent(): Observable<OidcUser> {
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

  private setCallbackInformation(isPopupCallback: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(StorageKeys.PopupCallback, `${isPopupCallback}`);
    }
  }
}
