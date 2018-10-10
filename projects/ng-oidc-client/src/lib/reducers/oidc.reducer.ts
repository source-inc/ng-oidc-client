import { User as OidcUser } from 'oidc-client';
import { OidcActionsUnion, OidcActionTypes } from '../actions/oidc.action';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

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

export function oidcReducer(state = initialState, action: OidcActionsUnion): OidcState {
  switch (action.type) {
    case OidcActionTypes.GetOidcUser:
    case OidcActionTypes.RemoveOidcUser: {
      return {
        ...state,
        loading: true
      };
    }

    case OidcActionTypes.OnUserLoaded: {
      return {
        ...state,
        loading: false,
        expiring: false
      };
    }

    case OidcActionTypes.OnUserUnloaded: {
      return {
        ...state,
        identity: null,
        expiring: false
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

    case OidcActionTypes.OnAccessTokenExpiring: {
      console.log('reducer expiring');
      return {
        ...state,
        expiring: true
      };
    }

    case OidcActionTypes.UserExpired: {
      return {
        ...state,
        expiring: false
      };
    }

    case OidcActionTypes.OnSilentRenewError: {
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

    case OidcActionTypes.SignInError: {
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

export const isIdentityExpired = createSelector(getOidcIdentity, (identity: OidcUser) => {
  if (identity == null) {
    return false;
  }
  return identity.expired;
});

// errors
export const selectOidcErrorState: MemoizedSelector<{}, ErrorState> = createSelector(
  selectOidcState,
  (state: OidcState) => state.errors
);

export const getSilentRenewError = createSelector(
  selectOidcErrorState,
  (errors: ErrorState) => errors.silentRenewError
);
