import { createFeatureSelector, createSelector } from '@ngrx/store';
import { fromSerializedUser } from '../oidc.utils';
import { OidcState } from '../reducers/oidc.reducer';

export const selectOidcState = createFeatureSelector<OidcState>('oidc');

export const getOidcConfigured = createSelector(selectOidcState, state => state.configured);

export const getOidcLoading = createSelector(selectOidcState, state => state.loading);

export const getOidcIdentity = createSelector(selectOidcState, state => fromSerializedUser(state.identity));

export const isIdentityExpiring = createSelector(selectOidcState, state => state.expiring);

export const isIdentityExpired = createSelector(getOidcIdentity, identity => identity != null && identity.expired);

export const isLoggedIn = createSelector(getOidcIdentity, identity => identity != null && identity.expired !== true);

// errors
export const selectOidcErrorState = createSelector(selectOidcState, state => state.errors);

export const getSilentRenewError = createSelector(selectOidcErrorState, errors => errors.silentRenewError);

export const getOidcConfigurationError = createSelector(selectOidcErrorState, errors => errors.configrationError);
