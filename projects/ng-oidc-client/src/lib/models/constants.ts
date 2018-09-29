export enum OidcEvent {
  AccessTokenExpired = 'addAccessTokenExpired',
  AccessTokenExpiring = 'addAccessTokenExpiring',
  SilentRenewError = 'AddSilentRenewError',
  UserLoaded = 'addUserLoaded',
  UserUnloaded = 'addUserUnloaded',
  UserSignedOut = 'addUserSignedOut'
}
