import { InjectionToken } from '@angular/core';
export const USER_CONFIG = new InjectionToken<Config>('USER_CONFIG');

export interface Config {
  urls: Urls;
}

export interface Urls {
  api: string;
}
