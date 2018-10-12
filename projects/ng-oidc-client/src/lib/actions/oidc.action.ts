import { Action } from '@ngrx/store';
import { User as OidcUser, User } from 'oidc-client';

export enum OidcActionTypes {
  GetOidcUser = '[Oidc] get oidc user',
  RemoveOidcUser = '[Oidc] remove oidc user',

  UserExpired = '[Oidc] user expired',
  UserFound = '[Oidc] user found',

  OnAccessTokenExpired = '[Oidc] on access token expired',
  OnAccessTokenExpiring = '[Oidc] user expiring',
  OnSilentRenewError = '[Oidc] on silent renew error',
  OnUserLoaded = '[Oidc] on user loaded',
  OnUserUnloaded = '[Oidc] on user unloaded',
  OnUserSignedOut = '[Oidc] on user signed out',
  OnSessionChanged = '[Oidc] session changed',

  UserLoading = '[Oidc] user loading',
  UserDoneLoading = '[Oidc] user done loading',
  UserLoadingError = '[Oidc] user loading error',

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

// OIDC COMMANDS

export class GetOidcUser implements Action {
  readonly type = OidcActionTypes.GetOidcUser;

  constructor(public payload: any) {}
}

export class RemoveOidcUser implements Action {
  readonly type = OidcActionTypes.RemoveOidcUser;
}

export class UserExpired implements Action {
  readonly type = OidcActionTypes.UserExpired;
}

export class UserFound implements Action {
  readonly type = OidcActionTypes.UserFound;

  constructor(public payload: OidcUser) {}
}

export class OnSessionChanged implements Action {
  readonly type = OidcActionTypes.OnSessionChanged;
}

export class OnAccessTokenExpired implements Action {
  readonly type = OidcActionTypes.OnAccessTokenExpired;
}

export class OnAccessTokenExpiring implements Action {
  readonly type = OidcActionTypes.OnAccessTokenExpiring;
}

export class OnUserLoading implements Action {
  readonly type = OidcActionTypes.UserLoading;
}

export class UserDoneLoading implements Action {
  readonly type = OidcActionTypes.UserDoneLoading;
}

export class UserLoadingError implements Action {
  readonly type = OidcActionTypes.UserLoadingError;
}

// OIDC EVENTS

export class OnUserLoaded implements Action {
  readonly type = OidcActionTypes.OnUserLoaded;

  constructor(public payload: OidcUser) {}
}

export class OnUserUnloaded implements Action {
  readonly type = OidcActionTypes.OnUserUnloaded;
}

export class OnUserSignedOut implements Action {
  readonly type = OidcActionTypes.OnUserSignedOut;
}

export class OnSilentRenewError implements Action {
  readonly type = OidcActionTypes.OnSilentRenewError;

  constructor(public payload: Error) {}
}

export class SigninPopup implements Action {
  readonly type = OidcActionTypes.SignInPopup;

  constructor(public payload: any) {}
}

export class SigninRedirect implements Action {
  readonly type = OidcActionTypes.SignInRedirect;

  constructor(public payload: any) {}
}

export class SignInError implements Action {
  readonly type = OidcActionTypes.SignInError;

  constructor(public payload: Error) {}
}

export class SignoutPopup implements Action {
  readonly type = OidcActionTypes.SignOutPopup;

  constructor(public payload: any) {}
}

export class SignoutRedirect implements Action {
  readonly type = OidcActionTypes.SignOutRedirect;

  constructor(public payload: any) {}
}

export class SignOutError implements Action {
  readonly type = OidcActionTypes.SignOutError;

  constructor(public payload: Error) {}
}

export class SigninSilent implements Action {
  readonly type = OidcActionTypes.SignInSilent;

  constructor(public payload: any) {}
}

export class OidcError implements Action {
  readonly type = OidcActionTypes.OidcError;
  constructor(public payload: any) {}
}

export type OidcActionsUnion =
  | GetOidcUser
  | RemoveOidcUser
  //
  | UserExpired
  | UserFound
  //
  | OnUserLoading
  | UserDoneLoading
  | UserLoadingError
  // Events
  | OnAccessTokenExpired
  | OnAccessTokenExpiring
  | OnSilentRenewError
  | OnUserLoaded
  | OnUserUnloaded
  | OnUserSignedOut
  | OnSessionChanged
  //
  | SigninPopup
  | SigninRedirect
  | SigninSilent
  | SignInError
  //
  | SignoutPopup
  | SignoutRedirect
  | SignOutError
  //
  | OidcError;
