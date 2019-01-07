import { User as OidcUser, User } from 'oidc-client';
import { AddIdentityGQL, IdentityFields, UpdateNgOidcInfoGQL } from '../graphql/generated/graphql';

export enum OidcActionTypes {
  GetOidcUser = '[Oidc] get oidc user',
  RemoveOidcUser = '[Oidc] remove oidc user',

  UserExpired = '[Oidc] user expired',
  UserFound = '[Oidc] user found',

  OnAccessTokenExpired = '[Oidc] on access token expired',
  OnAccessTokenExpiring = '[Oidc] user expiring',
  OnUserLoaded = '[Oidc] on user loaded',
  OnUserUnloaded = '[Oidc] on user unloaded',
  OnUserSignedOut = '[Oidc] on user signed out',
  OnSessionChanged = '[Oidc] session changed',

  UserLoading = '[Oidc] user loading',
  UserDoneLoading = '[Oidc] user done loading',

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
      identity: {
        ...payload,
        expired: payload.expired,
        expires_in: payload.expires_in
      }
    };
  }
}

export class OnSessionChanged {
  readonly type = OidcActionTypes.OnSessionChanged;
}

export class OnAccessTokenExpired {
  static type = OidcActionTypes.OnAccessTokenExpired;
}

export class OnAccessTokenExpiring {
  static mutation = new UpdateNgOidcInfoGQL(null).document;
  variables: any;

  constructor(public payload: boolean) {
    this.variables = {
      info: {
        expiring: payload,
        loading: null,
        errors: []
      }
    };
  }
}

export class OnUserLoading {
  readonly type = OidcActionTypes.UserLoading;
}

export class UserDoneLoading {
  readonly type = OidcActionTypes.UserDoneLoading;
}

// OIDC EVENTS

export class OnUserLoaded {
  readonly type = OidcActionTypes.OnUserLoaded;

  constructor(public payload: OidcUser) {}
}

export class OnUserUnloaded {
  static type = OidcActionTypes.OnUserUnloaded;
}

export class OnUserSignedOut {
  readonly type = OidcActionTypes.OnUserSignedOut;
}

export class OidcError {
  static type = OidcActionTypes.OidcError;
  constructor(public payload: Error) {}
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
  // Events
  | OnAccessTokenExpired
  | OnAccessTokenExpiring
  | OnUserLoaded
  | OnUserUnloaded
  | OnUserSignedOut
  | OnSessionChanged
  //
  | OidcError;
