import { User as OidcUser } from 'oidc-client';
import { OidcActionsUnion, OidcActionTypes } from '../actions/oidc.action';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface AuthState {
  identity: OidcUser | null;
  loading: boolean;
}

export const initialState: AuthState = {
  identity: null,
  loading: true
};

export function oidcReducer(state = initialState, action: OidcActionsUnion): AuthState {
  switch (action.type) {
    case OidcActionTypes.GetOidcUser: {
      return {
        ...state,
        loading: true
      };
    }

    case OidcActionTypes.OnUserLoaded: {
      return {
        ...state,
        loading: false
      };
    }

    case OidcActionTypes.OnUserUnloaded: {
      return {
        ...state,
        identity: null
      };
    }

    case OidcActionTypes.UserFound: {
      return {
        ...state,
        identity: action.payload
      };
    }

    case OidcActionTypes.UserLoading: {
      return {
        ...state,
        loading: true
      };
    }

    case OidcActionTypes.UserDoneLoading: {
      return {
        ...state,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}

// State Selectors

export const selectOidcState = createFeatureSelector<AuthState>('oidc');

export const getOidcLoading = createSelector(selectOidcState, (state: AuthState) => state.loading);
export const getOidcIdentity = createSelector(selectOidcState, (state: AuthState) => state.identity);
