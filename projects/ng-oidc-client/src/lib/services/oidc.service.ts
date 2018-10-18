import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Log, OidcClient, SigninRequest, SignoutRequest, User as OidcUser, UserManager } from 'oidc-client';
import { from, Observable } from 'rxjs';
import { Config, OIDC_CONFIG } from '../models/config.model';
import { OidcEvent, StorageKeys } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OidcService {
  private _oidcUserManager: UserManager;
  private _oidcClient: OidcClient;

  private _useCallbackFlag = true;

  constructor(@Inject(OIDC_CONFIG) private config: Config, @Inject(PLATFORM_ID) private platformId: Object) {
    const logSettings = this.config.log;
    let clientSettings = this.config.oidc_config;

    if (this.config.useCallbackFlag != null) {
      this._useCallbackFlag = this.config.useCallbackFlag;
    } else {
      this._useCallbackFlag = true;
    }

    if (logSettings) {
      Log.level = logSettings.level;
      Log.logger = logSettings.logger;
    }

    if (clientSettings.userStore != null) {
      clientSettings = {
        ...clientSettings,
        userStore: clientSettings.userStore()
      };
    }

    this._oidcUserManager = new UserManager(clientSettings);
    this._oidcClient = new OidcClient(clientSettings);
  }

  getUserManager(): UserManager {
    return this._oidcUserManager;
  }

  getOidcClient(): OidcClient {
    return this._oidcClient;
  }

  getOidcUser(): Observable<OidcUser> {
    return from(this._oidcUserManager.getUser());
  }

  removeOidcUser(): Observable<void> {
    return from(this._oidcUserManager.removeUser());
  }

  registerOidcEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    switch (event) {
      case OidcEvent.AccessTokenExpired:
        this._oidcUserManager.events.addAccessTokenExpired(callback);
        break;
      case OidcEvent.AccessTokenExpiring:
        this._oidcUserManager.events.addAccessTokenExpiring(callback);
        break;
      case OidcEvent.SilentRenewError:
        this._oidcUserManager.events.addSilentRenewError(callback);
        break;
      case OidcEvent.UserLoaded:
        this._oidcUserManager.events.addUserLoaded(callback);
        break;
      case OidcEvent.UserSessionChanged:
        this._oidcUserManager.events.addUserSessionChanged(callback);
        break;
      case OidcEvent.UserSignedOut:
        this._oidcUserManager.events.addUserSignedOut(callback);
        break;
      case OidcEvent.UserUnloaded:
        this._oidcUserManager.events.addUserUnloaded(callback);
        break;
      default:
        break;
    }
  }

  removeOidcEvent(event: OidcEvent, callback: (...ev: any[]) => void) {
    switch (event) {
      case OidcEvent.AccessTokenExpired:
        this._oidcUserManager.events.removeAccessTokenExpired(callback);
        break;
      case OidcEvent.AccessTokenExpiring:
        this._oidcUserManager.events.removeAccessTokenExpiring(callback);
        break;
      case OidcEvent.SilentRenewError:
        this._oidcUserManager.events.removeSilentRenewError(callback);
        break;
      case OidcEvent.UserLoaded:
        this._oidcUserManager.events.removeUserLoaded(callback);
        break;
      case OidcEvent.UserSessionChanged:
        this._oidcUserManager.events.removeUserSessionChanged(callback);
        break;
      case OidcEvent.UserSignedOut:
        this._oidcUserManager.events.removeUserSignedOut(callback);
        break;
      case OidcEvent.UserUnloaded:
        this._oidcUserManager.events.removeUserUnloaded(callback);
        break;
      default:
        break;
    }
  }

  signInPopup(args?: any): Observable<OidcUser> {
    this.setCallbackInformation(true);

    return from(this._oidcUserManager.signinPopup({ ...args }));
  }

  signInRedirect(args?: any): Observable<OidcUser> {
    this.setCallbackInformation(false);

    return from(this._oidcUserManager.signinRedirect({ ...args }));
  }

  signOutPopup(args?: any): Observable<any> {
    this.setCallbackInformation(true);

    return from(this._oidcUserManager.signoutPopup({ ...args }));
  }

  signOutRedirect(args?: any): Observable<any> {
    this.setCallbackInformation(false);

    return from(this._oidcUserManager.signoutRedirect({ ...args }));
  }

  signInSilent(args?: any): Observable<OidcUser> {
    return from(this._oidcUserManager.signinSilent({ ...args }));
  }

  signinPopupCallback(): Observable<any> {
    return from(this._oidcUserManager.signinPopupCallback());
  }

  signinRedirectCallback(): Observable<OidcUser> {
    return from(this._oidcUserManager.signinRedirectCallback());
  }

  signoutPopupCallback(): Observable<void> {
    return from(this._oidcUserManager.signoutPopupCallback());
  }

  signoutRedirectCallback(): Observable<any> {
    return from(this._oidcUserManager.signoutRedirectCallback());
  }

  getSigninUrl(args?: any): Observable<SigninRequest> {
    return from(this._oidcUserManager.createSigninRequest(args));
  }

  getSignoutUrl(args?: any): Observable<SignoutRequest> {
    return from(this._oidcUserManager.createSignoutRequest(args));
  }

  private setCallbackInformation(isPopupCallback: boolean) {
    // is browser and useCallbackFlag set to true or defaults to true
    if (isPlatformBrowser(this.platformId) && this._useCallbackFlag) {
      localStorage.setItem(StorageKeys.PopupCallback, `${isPopupCallback}`);
    }
  }
}
