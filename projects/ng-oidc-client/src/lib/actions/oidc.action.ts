import { Action } from '@ngrx/store';
import { User as OidcUser, User } from 'oidc-client';

export enum OidcActionTypes {
  GetOidcUser = '[Oidc] get oidc user',
  RemoveOidcUser = '[Oidc] remove oidc user',

  UserExpired = '[Oidc] user expired',
  UserFound = '[Oidc] user found',
  SilentRenewError = '[Oidc] silent renew error',
  SessionTerminated = '[Oidc] session terminated',
  UserExpiring = '[Oidc] user expiring',
  UserLoading = '[Oidc] user loading',
  UserDoneLoading = '[Oidc] user done loading',
  UserLoadingError = '[Oidc] user loading error',
  OnUserLoaded = '[Oidc] on user loaded',
  OnUserUnloaded = '[Oidc] on user unloaded',
  OnUserSignedOut = '[Oidc] on user signed out',

  SignInSilent = '[Oidc] sign in silent',
  OnIdentityChanged = '[Oidc] on identity changed',
  OnIdentityEstablished = '[Oidc] on identity establised',
  OnIdentityRemoved = '[Oidc] on identityremoved',

  OidcError = '[Oidc] error'
}

// OIDC COMMANDS

export class GetOidcUser implements Action {
  readonly type = OidcActionTypes.GetOidcUser;
}

export class RemoveOidcUser implements Action {
  readonly type = OidcActionTypes.RemoveOidcUser;
}

export class SignInSilent implements Action {
  readonly type = OidcActionTypes.SignInSilent;
}

//

export class UserExpired implements Action {
  readonly type = OidcActionTypes.UserExpired;
}

export class UserFound implements Action {
  readonly type = OidcActionTypes.UserFound;

  constructor(public payload: OidcUser) {}
}

export class SesssionTerminated implements Action {
  readonly type = OidcActionTypes.SessionTerminated;
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

  constructor(public payload: any) {}
}

export class OnIdentityEstablished implements Action {
  readonly type = OidcActionTypes.OnIdentityEstablished;
}

export class OnIdentityChanged implements Action {
  readonly type = OidcActionTypes.OnIdentityChanged;
}

export class OnIdentityRemoved implements Action {
  readonly type = OidcActionTypes.OnIdentityRemoved;
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
  | SesssionTerminated
  | UserExpiring
  | UserLoading
  | UserDoneLoading
  | UserLoadingError
  | OnUserLoaded
  | OnUserUnloaded
  | OnUserSignedOut
  | SignInSilent
  | OnIdentityEstablished
  | OnIdentityChanged
  | OnIdentityRemoved
  //
  | OidcError;
