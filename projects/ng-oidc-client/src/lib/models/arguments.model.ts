export interface RequestArugments {
  // mandatory
  url?: string;
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  authority?: string;
  // optional
  data?: any;
  state?: any;
  prompt?: string;
  display?: string;
  max_age?: number;
  ui_locales?: string;
  id_token_hint?: string;
  login_hint?: string;
  acr_values?: string;
  resource?: string;
  request?: any;
  request_uri?: string;
  extraQueryParams?: any;
  extraTokenParams?: any; // https://github.com/IdentityModel/oidc-client-js/issues/745 
  skipUserInfo?: boolean; // https://github.com/IdentityModel/oidc-client-js/issues/825
  response_mode?: string; // https://github.com/IdentityModel/oidc-client-js/commit/5fbce7cfe529a706a99366bc5024c07dee024103#diff-daf6bf2d1b132f4a29f19d017b195b7c
}