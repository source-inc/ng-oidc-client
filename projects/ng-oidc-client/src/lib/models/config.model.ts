import { InjectionToken } from '@angular/core';
import { UserManagerSettings, Logger, WebStorageStateStore } from 'oidc-client';


interface NgOidcConfigSettings extends UserManagerSettings {
  userStore?: WebStorageStateStore | any;
}

export interface Config {
  oidc_config: NgOidcConfigSettings;
  useCallbackFlag?: boolean;
  log?: {
    logger: Logger;
    level: number;
  };
}
export const OIDC_CONFIG = new InjectionToken<Config>('OIDC_CONFIG');
