import { InjectionToken } from '@angular/core';
import { UserManagerSettings } from 'oidc-client';

export interface Config extends UserManagerSettings {
  test?: string;
}
export const OIDC_CONFIG = new InjectionToken<Config>('OIDC_CONFIG');
