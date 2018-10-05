import { Action } from '@ngrx/store';
import { User } from '../models';

export enum UserActionTypes {
  USER_GET_ME = '[User] GET me',
  USER_GET_ME_SUCCESS = '[User] GET me success',
  USER_GET_ME_ERROR = '[User] GET me error',
  USER_CLEAR = '[User] clear',
  USER_LOGOUT = '[User] logout',
  USER_LOGGED_OUT = '[User] user logged out',
  USER_ERROR = '[User] error'
}

export class GetUserMe implements Action {
  readonly type = UserActionTypes.USER_GET_ME;
}

export class GetUserMeSuccess implements Action {
  readonly type = UserActionTypes.USER_GET_ME_SUCCESS;

  constructor(public payload: User) {}
}

export class GetUserMeError implements Action {
  readonly type = UserActionTypes.USER_GET_ME_ERROR;

  constructor(public payload: any) {}
}

export class ClearUserMe implements Action {
  readonly type = UserActionTypes.USER_CLEAR;
}

export class UserLogout implements Action {
  readonly type = UserActionTypes.USER_LOGOUT;
}

export class UserLoggedOut implements Action {
  readonly type = UserActionTypes.USER_LOGGED_OUT;
}

export class UserError implements Action {
  readonly type = UserActionTypes.USER_ERROR;

  constructor(public payload: any) {}
}

export type UserActions =
  | GetUserMe
  | GetUserMeSuccess
  | GetUserMeError
  | ClearUserMe
  | UserLogout
  | UserLoggedOut
  | UserError;
