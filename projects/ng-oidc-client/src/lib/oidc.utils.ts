import { User as OidcUser, User, UserSettings } from 'oidc-client';

export function toSerializedUser(user: OidcUser): UserSettings {
  if (user != null) {
    return {
      id_token: user.id_token,
      session_state: user.session_state,
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      token_type: user.token_type,
      scope: user.scope,
      profile: user.profile,
      expires_at: user.expires_at,
      state: user.state
    };
  } else {
    return null;
  }
}

export function fromSerializedUser(user: UserSettings): OidcUser {
  if (user != null) {
    return new User(user);
  } else {
    return null;
  }
}
