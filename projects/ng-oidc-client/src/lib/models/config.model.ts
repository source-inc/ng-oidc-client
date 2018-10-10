import { InjectionToken } from '@angular/core';
import { UserManagerSettings, Logger } from 'oidc-client';

export interface Config {
  oidc_config: UserManagerSettings;
  log?: {
    logger: Logger;
    level: number;
  };
}
export const OIDC_CONFIG = new InjectionToken<Config>('OIDC_CONFIG');
