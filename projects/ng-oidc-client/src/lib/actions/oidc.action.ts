import { User as OidcUser, User } from 'oidc-client';
import { AddIdentityGQL, IdentityFields, UpdateNgOidcInfoGQL } from '../graphql/generated/graphql';

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

export class GetOidcUser {
  readonly type = OidcActionTypes.GetOidcUser;

  constructor(public payload: any) {}
}

export class RemoveOidcUser {
  readonly type = OidcActionTypes.RemoveOidcUser;
}

export class UserExpired {
  readonly type = OidcActionTypes.UserExpired;
}

export class UserFound {
  static mutation = new AddIdentityGQL(null).document;
  readonly type = OidcActionTypes.UserFound;
  variables: any;

  constructor(public payload: OidcUser) {
    this.variables = {
      id_token: payload.id_token,
      access_token: payload.access_token,
      profile: {
        name: payload.profile.name,
        sid: payload.profile.sid
      }
    };
  }
}

export class OnSessionChanged {
  readonly type = OidcActionTypes.OnSessionChanged;
}

export class OnAccessTokenExpired {
  readonly type = OidcActionTypes.OnAccessTokenExpired;
}

export class OnAccessTokenExpiring {
  static mutation = new UpdateNgOidcInfoGQL(null).document;
  readonly type = OidcActionTypes.OnAccessTokenExpiring;
}

export class OnUserLoading {
  readonly type = OidcActionTypes.UserLoading;
}

export class UserDoneLoading {
  readonly type = OidcActionTypes.UserDoneLoading;
}

export class UserLoadingError {
  readonly type = OidcActionTypes.UserLoadingError;
}

// OIDC EVENTS

export class OnUserLoaded {
  readonly type = OidcActionTypes.OnUserLoaded;

  constructor(public payload: OidcUser) {}
}

export class OnUserUnloaded {
  readonly type = OidcActionTypes.OnUserUnloaded;
}

export class OnUserSignedOut {
  readonly type = OidcActionTypes.OnUserSignedOut;
}

export class OnSilentRenewError {
  readonly type = OidcActionTypes.OnSilentRenewError;

  constructor(public payload: Error) {}
}

export class SigninPopup {
  readonly type = OidcActionTypes.SignInPopup;

  constructor(public payload: any) {}
}

export class SigninRedirect {
  readonly type = OidcActionTypes.SignInRedirect;

  constructor(public payload: any) {}
}

export class SignInError {
  readonly type = OidcActionTypes.SignInError;

  constructor(public payload: Error) {}
}

export class SignoutPopup {
  readonly type = OidcActionTypes.SignOutPopup;

  constructor(public payload: any) {}
}

export class SignoutRedirect {
  readonly type = OidcActionTypes.SignOutRedirect;

  constructor(public payload: any) {}
}

export class SignOutError {
  readonly type = OidcActionTypes.SignOutError;

  constructor(public payload: Error) {}
}

export class SigninSilent {
  readonly type = OidcActionTypes.SignInSilent;

  constructor(public payload: any) {}
}

export class OidcError {
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
