import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Log, OidcClient, User as OidcUser, UserManager } from 'oidc-client';
import { from, Observable } from 'rxjs';
import { Config, OidcEvent, RequestArugments, StorageKeys } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OidcService {
  private _oidcUserManager: UserManager = new UserManager({});
  private _oidcClient: OidcClient = new OidcClient({});
  private _useCallbackFlag = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  configureClient(config: Config) {
    let { oidc_config = {} } = config || {};
    const { log = null, useCallbackFlag = true } = config || {};

    if (useCallbackFlag != null) {
      this._useCallbackFlag = useCallbackFlag;
    } else {
      this._useCallbackFlag = true;
    }

    if (log != null) {
      Log.level = log.level;
      Log.logger = log.logger;
    }

    if (oidc_config.userStore != null) {
      oidc_config = {
        ...oidc_config,
        userStore: oidc_config.userStore()
      };
    }

    this._oidcUserManager = new UserManager(oidc_config);
    this._oidcClient = new OidcClient(oidc_config);
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

  signInPopup(args?: RequestArugments) {
    this.setCallbackInformation(true);
    return from(this._oidcUserManager.signinPopup({ ...args }));
  }

  signInRedirect(args?: RequestArugments) {
    this.setCallbackInformation(false);
    return from(this._oidcUserManager.signinRedirect({ ...args }));
  }

  signOutPopup(args?: RequestArugments) {
    this.setCallbackInformation(true);
    return from(this._oidcUserManager.signoutPopup({ ...args }));
  }

  signOutRedirect(args?: RequestArugments) {
    this.setCallbackInformation(false);
    return from(this._oidcUserManager.signoutRedirect({ ...args }));
  }

  signInSilent(args?: RequestArugments) {
    return from(this._oidcUserManager.signinSilent({ ...args }));
  }

  signinPopupCallback() {
    return from(this._oidcUserManager.signinPopupCallback());
  }

  signinRedirectCallback() {
    return from(this._oidcUserManager.signinRedirectCallback());
  }

  signoutPopupCallback() {
    return from(this._oidcUserManager.signoutPopupCallback());
  }

  signoutRedirectCallback() {
    return from(this._oidcUserManager.signoutRedirectCallback());
  }

  getSigninUrl(args?: RequestArugments) {
    return from(this._oidcUserManager.createSigninRequest(args));
  }

  getSignoutUrl(args?: RequestArugments) {
    return from(this._oidcUserManager.createSignoutRequest(args));
  }

  private setCallbackInformation(isPopupCallback: boolean) {
    // is browser and useCallbackFlag set to true or defaults to true
    if (isPlatformBrowser(this.platformId) && this._useCallbackFlag) {
      localStorage.setItem(StorageKeys.PopupCallback, `${isPopupCallback}`);
    }
  }
}
