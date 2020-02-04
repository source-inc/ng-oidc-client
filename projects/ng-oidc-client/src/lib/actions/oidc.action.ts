import { createAction, props } from '@ngrx/store';
import { UserSettings } from 'oidc-client';
import { RequestArugments } from '../models';

export enum OidcActionTypes {
  ClientConfigued = '[Oidc] client configured',
  ClientConfigError = '[Oidc] client configuration error',
  GetOidcUser = '[Oidc] get oidc user',
  RemoveOidcUser = '[Oidc] remove oidc user',
  UserExpired = '[Oidc] user expired',
  UserFound = '[Oidc] user found',
  UserLoading = '[Oidc] user loading',
  UserDoneLoading = '[Oidc] user done loading',
  UserLoadingError = '[Oidc] user loading error',

  // Events
  OnAccessTokenExpired = '[Oidc] on access token expired',
  OnAccessTokenExpiring = '[Oidc] user expiring',
  OnSilentRenewError = '[Oidc] on silent renew error',
  OnUserLoaded = '[Oidc] on user loaded',
  OnUserUnloaded = '[Oidc] on user unloaded',
  OnUserSignedOut = '[Oidc] on user signed out',
  OnSessionChanged = '[Oidc] session changed',

  // Sign In
  SignInPopup = '[Oidc] sign in popup',
  SignInRedirect = '[Oidc] sign in redirect',
  SignInSilent = '[Oidc] sign in silent',
  SignInError = '[Oidc] sign in popup error',

  // Sign Out
  SignOutPopup = '[Oidc] sign out popup',
  SignOutRedirect = '[Oidc] sign out redirect',
  SignOutError = '[Oidc] sign out popup error',

  OidcError = '[Oidc] error'
}

export const ClientConfigured = createAction(OidcActionTypes.ClientConfigued);

export const ClientConfigError = createAction(OidcActionTypes.ClientConfigError, props<{ payload?: string }>());

export const GetOidcUser = createAction(OidcActionTypes.GetOidcUser, props<{ payload?: RequestArugments }>());

export const RemoveOidcUser = createAction(OidcActionTypes.RemoveOidcUser);

export const UserExpired = createAction(OidcActionTypes.UserExpired);

export const UserFound = createAction(OidcActionTypes.UserFound, props<{ payload?: UserSettings }>());

export const OnSessionChanged = createAction(OidcActionTypes.OnSessionChanged);

export const OnAccessTokenExpired = createAction(OidcActionTypes.OnAccessTokenExpired);

export const OnAccessTokenExpiring = createAction(OidcActionTypes.OnAccessTokenExpiring);

export const OnUserLoading = createAction(OidcActionTypes.UserLoading);

export const UserDoneLoading = createAction(OidcActionTypes.UserDoneLoading);

export const UserLoadingError = createAction(OidcActionTypes.UserLoadingError);

export const OnUserLoaded = createAction(OidcActionTypes.OnUserLoaded, props<{ payload: UserSettings }>());

export const OnUserUnloaded = createAction(OidcActionTypes.OnUserUnloaded);

export const OnUserSignedOut = createAction(OidcActionTypes.OnUserSignedOut);

export const OnSilentRenewError = createAction(OidcActionTypes.OnSilentRenewError, props<{ payload: string }>());

export const SigninPopup = createAction(OidcActionTypes.SignInPopup, props<{ payload?: RequestArugments }>());

export const SigninRedirect = createAction(OidcActionTypes.SignInRedirect, props<{ payload?: RequestArugments }>());

export const SignoutPopup = createAction(OidcActionTypes.SignOutPopup, props<{ payload?: RequestArugments }>());

export const SignOutRedirect = createAction(OidcActionTypes.SignOutRedirect, props<{ payload?: RequestArugments }>());

export const SigninSilent = createAction(OidcActionTypes.SignInSilent, props<{ payload?: RequestArugments }>());

export const SignInError = createAction(OidcActionTypes.SignInError, props<{ payload: string }>());

export const SignOutError = createAction(OidcActionTypes.SignOutError, props<{ payload: string }>());

export const OidcError = createAction(OidcActionTypes.OidcError, props<{ payload: any }>());
