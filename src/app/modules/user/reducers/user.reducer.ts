import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserActions, UserActionTypes } from '../actions/user.action';
import { User } from '../models';

export interface UserState {
  details: User;
  loading: boolean;
}

export const initialState: UserState = {
  details: null,
  loading: false
};

export function userReducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.USER_GET_ME:
      return { ...state, loading: true };

    case UserActionTypes.USER_GET_ME_SUCCESS:
      return { ...state, details: action.payload, loading: false };

    case UserActionTypes.USER_GET_ME_ERROR:
      return { ...state, loading: false };

    case UserActionTypes.USER_CLEAR:
      return { ...state, ...initialState };

    default:
      return state;
  }
}

// State Selectors

export const selectUserState = createFeatureSelector<UserState>('user');

export const getUserLoading = createSelector(selectUserState, (state: UserState) => state.loading);
export const getUserDetails = createSelector(selectUserState, (state: UserState) => state.details);
