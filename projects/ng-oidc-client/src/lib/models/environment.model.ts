export interface EnvironmentConfig {
  urls: EnvironmentUrls;
  client: EnvironmentClients;
}

export interface EnvironmentUrls {
  authority: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  silent_redirect_uri: string;
}

export interface EnvironmentClients {
  id: string;
  scope: string;
}
