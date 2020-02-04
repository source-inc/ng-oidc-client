interface RequestArgs {
  // mandatory
  url: string;
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  authority: string;
  // optional
  data: any;
  state: any;
  prompt: string;
  display: string;
  max_age: number;
  ui_locales: string;
  id_token_hint: string;
  login_hint: string;
  acr_values: string;
  resource: string;
  request: any;
  request_uri: string;
  extraQueryParams: any;
  skipUserInfo: boolean;
  extraTokenParams: any;
  response_mode: string;
  [key: string]: any;
}

export type RequestArugments = Partial<RequestArgs>;
