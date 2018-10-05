import { Action } from '@ngrx/store';
import { User as OidcUser, User } from 'oidc-client';

export enum OidcActionTypes {
  GetOidcUser = '[Oidc] get oidc user',
  RemoveOidcUser = '[Oidc] remove oidc user',

  UserExpired = '[Oidc] user expired',
  UserFound = '[Oidc] user found',
  SilentRenewError = '[Oidc] silent renew error',

  SessionTerminated = '[Oidc] session terminated',
  SessionChanged = '[Oidc] session changed',

  UserExpiring = '[Oidc] user expiring',
  UserLoading = '[Oidc] user loading',
  UserDoneLoading = '[Oidc] user done loading',
  UserLoadingError = '[Oidc] user loading error',
  OnUserLoaded = '[Oidc] on user loaded',
  OnUserUnloaded = '[Oidc] on user unloaded',
  OnUserSignedOut = '[Oidc] on user signed out',

  SignInPopup = '[Oidc] sign in popup',
  SignInRedirect = '[Oidc] sign in redirect',
  SignInPopupError = '[Oidc] sign in popup error',
  SignOutPopup = '[Oidc] sign out popup',
  SignOutRedirect = '[Oidc] sign out redirect',
  SignInSilent = '[Oidc] sign in silent',

  OidcError = '[Oidc] error'
}

// OIDC COMMANDS

export class GetOidcUser implements Action {
  readonly type = OidcActionTypes.GetOidcUser;
}

export class RemoveOidcUser implements Action {
  readonly type = OidcActionTypes.RemoveOidcUser;
}

//

export class UserExpired implements Action {
  readonly type = OidcActionTypes.UserExpired;
}

export class UserFound implements Action {
  readonly type = OidcActionTypes.UserFound;

  constructor(public payload: OidcUser) {}
}

export class SessionTerminated implements Action {
  readonly type = OidcActionTypes.SessionTerminated;
}

export class SessionChanged implements Action {
  readonly type = OidcActionTypes.SessionChanged;
}

export class UserExpiring implements Action {
  readonly type = OidcActionTypes.UserExpiring;
}

export class UserLoading implements Action {
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

export class SilentRenewError implements Action {
  readonly type = OidcActionTypes.SilentRenewError;

  constructor(public payload: Error) {}
}

export class SignInPopup implements Action {
  readonly type = OidcActionTypes.SignInPopup;

  constructor(public payload: any) {}
}

export class SignInRedirect implements Action {
  readonly type = OidcActionTypes.SignInRedirect;

  constructor(public payload: any) {}
}

export class SignInPopupError implements Action {
  readonly type = OidcActionTypes.SignInPopupError;

  constructor(public payload: Error) {}
}

export class SignOutPopup implements Action {
  readonly type = OidcActionTypes.SignOutPopup;

  constructor(public payload: any) {}
}

export class SignOutRedirect implements Action {
  readonly type = OidcActionTypes.SignOutRedirect;

  constructor(public payload: any) {}
}

export class SignInSilent implements Action {
  readonly type = OidcActionTypes.SignInSilent;
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
  | SilentRenewError
  //
  | SessionTerminated
  | SessionChanged
  //
  | UserExpiring
  | UserLoading
  | UserDoneLoading
  | UserLoadingError
  | OnUserLoaded
  | OnUserUnloaded
  | OnUserSignedOut
  //
  | SignInPopup
  | SignInRedirect
  | SignInPopupError
  | SignOutPopup
  | SignOutRedirect
  | SignInSilent
  //
  | OidcError;
