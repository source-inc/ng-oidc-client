import { User as OidcUser } from 'oidc-client';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { OidcActions } from '../actions';

export interface OidcState {
  identity: OidcUser | null;
  loading: boolean;
  expiring: boolean;
  errors: ErrorState;
}

export interface ErrorState {
  silentRenewError: any;
  signInError: any;
}

export const initialState: OidcState = {
  identity: null,
  loading: true,
  expiring: false,
  errors: {
    silentRenewError: null,
    signInError: null
  }
};

export function oidcReducer(state = initialState, action: OidcActions.OidcActionsUnion): OidcState {
  switch (action.type) {
    case OidcActions.OidcActionTypes.GetOidcUser:
    case OidcActions.OidcActionTypes.RemoveOidcUser: {
      return {
        ...state,
        loading: true
      };
    }

    case OidcActions.OidcActionTypes.OnUserLoaded: {
      return {
        ...state,
        loading: false,
        expiring: false
      };
    }

    case OidcActions.OidcActionTypes.OnUserUnloaded: {
      return {
        ...state,
        identity: null,
        expiring: false
      };
    }

    case OidcActions.OidcActionTypes.UserFound: {
      return {
        ...state,
        identity: action.payload
      };
    }

    case OidcActions.OidcActionTypes.UserLoading: {
      return {
        ...state,
        loading: true
      };
    }

    case OidcActions.OidcActionTypes.UserDoneLoading: {
      return {
        ...state,
        loading: false
      };
    }

    case OidcActions.OidcActionTypes.OnAccessTokenExpiring: {
      return {
        ...state,
        expiring: true
      };
    }

    case OidcActions.OidcActionTypes.UserExpired: {
      return {
        ...state,
        expiring: false
      };
    }

    case OidcActions.OidcActionTypes.OnSilentRenewError: {
      return {
        ...state,
        errors: {
          ...state.errors,
          silentRenewError: {
            message: action.payload.message,
            name: action.payload.name,
            stack: action.payload.stack
          }
        }
      };
    }

    case OidcActions.OidcActionTypes.SignInError: {
      return {
        ...state,
        errors: {
          ...state.errors,
          signInError: {
            message: action.payload.message,
            name: action.payload.name,
            stack: action.payload.stack
          }
        }
      };
    }

    default: {
      return state;
    }
  }
}

// State Selectors

export const selectOidcState = createFeatureSelector<OidcState>('oidc');

export const getOidcLoading = createSelector(selectOidcState, (state: OidcState) => state.loading);
export const getOidcIdentity = createSelector(selectOidcState, (state: OidcState) => state.identity);
export const isIdentityExpiring = createSelector(selectOidcState, (state: OidcState) => state.expiring);
export const isIdentityExpired = createSelector(
  getOidcIdentity,
  (identity: OidcUser) => identity != null && identity.expired
);
export const isLoggedIn = createSelector(
  getOidcIdentity,
  (identity: OidcUser) => identity != null && identity.expired !== true
);

// errors
export const selectOidcErrorState: MemoizedSelector<{}, ErrorState> = createSelector(
  selectOidcState,
  (state: OidcState) => state.errors
);

export const getSilentRenewError = createSelector(
  selectOidcErrorState,
  (errors: ErrorState) => errors.silentRenewError
);
