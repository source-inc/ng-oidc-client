import { Action, createReducer, on } from '@ngrx/store';
import { UserSettings } from 'oidc-client';
import { OidcActions } from '../actions';

export interface ErrorState {
  silentRenewError: string;
  signInError: string;
  configrationError: string;
}

export interface OidcState {
  configured: boolean;
  identity: UserSettings;
  expiring: boolean;
  loading: boolean;
  errors: ErrorState;
}

export const initialState: OidcState = {
  configured: false,
  identity: null,
  expiring: false,
  loading: true,
  errors: {
    silentRenewError: null,
    signInError: null,
    configrationError: null
  }
};

const _oidcReducer = createReducer(
  initialState,

  on(OidcActions.ClientConfigured, state => ({
    ...state,
    configured: true
  })),
  on(OidcActions.GetOidcUser, state => ({
    ...state,
    loading: true
  })),
  on(OidcActions.RemoveOidcUser, state => ({
    ...state,
    loading: true
  })),
  on(OidcActions.OnUserLoaded, state => ({
    ...state,
    loading: false,
    expiring: false
  })),
  on(OidcActions.OnUserUnloaded, state => ({
    ...state,
    identity: null,
    expiring: false
  })),
  on(OidcActions.UserFound, (state, { payload }) => ({
    ...state,
    identity: payload,
    loading: false
  })),
  on(OidcActions.OnUserLoading, state => ({
    ...state,
    loading: true
  })),
  on(OidcActions.UserDoneLoading, state => ({
    ...state,
    loading: false
  })),
  on(OidcActions.OnAccessTokenExpiring, state => ({
    ...state,
    expiring: true
  })),
  on(OidcActions.UserExpired, state => ({
    ...state,
    expiring: false
  })),
  on(OidcActions.ClientConfigError, (state, { payload }) => ({
    ...state,
    errors: {
      ...state.errors,
      configrationError: payload
    }
  })),
  on(OidcActions.OnSilentRenewError, (state, { payload }) => ({
    ...state,
    errors: {
      ...state.errors,
      silentRenewError: payload
    }
  })),
  on(OidcActions.SignInError, (state, { payload }) => ({
    ...state,
    errors: {
      ...state.errors,
      signInError: payload
    }
  }))
);

export function oidcReducer(state: OidcState, action: Action) {
  return _oidcReducer(state, action);
}
