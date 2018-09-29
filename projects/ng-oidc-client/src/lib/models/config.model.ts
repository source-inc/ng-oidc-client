import { InjectionToken } from '@angular/core';
import { EnvironmentConfig } from '.';

export interface Config {
  environment: EnvironmentConfig;
  automaticSilentRenew?: boolean;
  accessTokenExpiringNotificationTime?: number;
  filterProtocolClaims?: boolean;
  loadUserInfo?: boolean;
}
export const OIDC_CONFIG = new InjectionToken<Config>('OIDC_CONFIG');
